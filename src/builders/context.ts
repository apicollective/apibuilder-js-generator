import {
  ApiBuilderEnum,
  ApiBuilderInvocationFormConfig,
  ApiBuilderModel,
  ApiBuilderService,
  ApiBuilderType,
  ApiBuilderUnion,
  isEnclosingType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} from 'apibuilder-js';

import { identity } from 'lodash';

import { Context, DependencyRecord, TypeRecord } from './types';

type Edge = [string, string];

// tslint:disable-next-line: interface-name
interface Node {
  id: string;
  afters: string[];
}

interface ContextBuilderOptions {
  isTypeAllowed(type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion): boolean;
}

class Node implements Node {
  constructor(id: string) {
    this.id = id;
    this.afters = [];
  }
}

function buildDependencyList(
  type: ApiBuilderType,
) {
  const dependencies = new Set<string>([]);

  function add(dependency: ApiBuilderType) {
    if (isPrimitiveType(dependency)) return;
    if (isEnclosingType(dependency)) return add(dependency.ofType);
    dependencies.add(dependency.fullName);
  }

  if (isEnclosingType(type)) {
    add(type.ofType);
  } else if (isModelType(type)) {
    type.fields.forEach((field) => { add(field.type); });
  } else if (isUnionType(type)) {
    type.types.forEach((unionType) => { add(unionType.type); });
  }

  return dependencies;
}

function buildDependencyRecord(
  services: ApiBuilderService[],
): DependencyRecord {
  const record: DependencyRecord = {};

  const add = (type: ApiBuilderType) => {
    // Primitive types have no dependencies
    if (isPrimitiveType(type)) {
      return;
    }

    // Add dependencies for enclosed type
    if (isEnclosingType(type)) {
      return add(type.ofType);
    }

    const dependencies = record[type.fullName];

    // Avoid overwriting resolved types with unresolved types.
    if (dependencies != null && dependencies.size > 0) {
      return;
    }

    record[type.fullName] = buildDependencyList(type);
  };

  services.forEach((service) => {
    service.enums.forEach((enumeration) => {
      add(enumeration);
    });

    service.models.forEach((model) => {
      add(model);

      model.fields.forEach((field) => {
        add(field.type);
      });
    });

    service.unions.forEach((union) => {
      add(union);

      union.types.forEach((unionType) => {
        add(unionType.type);
      });
    });

    service.resources.forEach((resource) => {
      resource.operations.forEach((operation) => {
        operation.parameters.forEach(({ type }) => {
          add(type);
        });

        operation.responses.forEach(({ type }) => {
          add(type);
        });
      });
    });
  });

  return record;
}

function buildTypeRecord(services: ApiBuilderService[]) {
  return services.reduce<TypeRecord>((previousValue, service) => {
    service.enums.forEach((enumeration) => {
      previousValue[enumeration.fullName] = enumeration;
    });

    service.models.forEach((model) => {
      previousValue[model.fullName] = model;
    });

    service.unions.forEach((union) => {
      previousValue[union.fullName] = union;
    });

    return previousValue;
  // tslint:disable-next-line: align
  }, {});
}

function topologicalSort(dependencies: DependencyRecord) {
  const edges: Edge[] = [];
  const nodes: Record<string, Node> = {};
  const sorted: string[] = [];
  const visited: Record<string, boolean> = {};
  const cyclic: string[] = [];

  Object.keys(dependencies).forEach((dependent) => {
    dependencies[dependent].forEach((dependency) => {
      edges.push([dependency, dependent]);
    });
  });

  edges.forEach(([from, to]) => {
    if (!nodes[from]) nodes[from] = new Node(from);
    if (!nodes[to]) nodes[to] = new Node(to);
    nodes[from].afters.push(to);
  });

  function visit(key: string, ancestors: string[] = []) {
    const node = nodes[key];
    const id = node.id;

    if (visited[key]) return;

    ancestors.push(id);

    visited[key] = true;

    node.afters.forEach((afterId) => {
      // When there are cycles, there is no definite order, so that would make
      // the order ambiguous. We are going to record the cyclic type to return
      // as feedback to generators.
      if (ancestors.includes(afterId)) {
        cyclic.push(id);
      } else {
        visit(afterId.toString(), ancestors.map(identity));
      }
    });

    sorted.unshift(id);
  }

  Object.keys(nodes).forEach((key) => {
    visit(key);
  });

  return {
    cyclicTypes: cyclic,
    sortedTypes: sorted,
  };
}

export function buildContext(
  invocationForm: ApiBuilderInvocationFormConfig,
  options: Partial<ContextBuilderOptions> = {},
): Context {
  const defaultIsTypeAllowed = () => true;
  const {
    isTypeAllowed = defaultIsTypeAllowed,
  } = options;
  const rootService = new ApiBuilderService(invocationForm.service);
  const importedServices = invocationForm.imported_services.map(_ => new ApiBuilderService(_));
  const allServices = [rootService].concat(importedServices);
  const typesByName = buildTypeRecord(allServices);
  const dependencyRecord = buildDependencyRecord(allServices);

  const { cyclicTypes, sortedTypes } = topologicalSort(dependencyRecord);

  // Types not included in the topological graph because they are independent.
  // These types can be added at any position in the ordered list.
  const orphanTypes = Object.keys(dependencyRecord).filter(key => !sortedTypes.includes(key));

  const allSortedTypes = sortedTypes.concat(orphanTypes);

  // Types not included in the invocation form.
  const unresolvedTypes = allSortedTypes.filter((key) => {
    return typesByName[key] == null;
  });


  const addTypeWithDependencies = (
    collection: Set<string>,
    typeName: string,
    predicate?: (typeName: string) => boolean,
  ) => {
    collection.add(typeName);
    const dependencies = dependencyRecord[typeName];
    if (dependencies != null) {
      dependencies.forEach((dependency) => {
        if (typeof predicate !== 'function' || predicate(dependency)) {
          addTypeWithDependencies(collection, dependency, predicate);
        }
      });
    }
    return collection;
  };

  // Types to be generated.
  const allowTypes = allServices.reduce<Set<string>>((_, service) => {
    [
      ...service.enums,
      ...service.models,
      ...service.unions,
    ].forEach((type) => {
      if (isTypeAllowed(type)) {
        addTypeWithDependencies(_, type.fullName);
      }
    });

    return _;
  }, new Set());

  const context: Context = {
    allowTypes,
    cyclicTypes,
    importedServices,
    rootService,
    sortedTypes: allSortedTypes,
    typesByName,
    unresolvedTypes,
  };

  return context;
}
