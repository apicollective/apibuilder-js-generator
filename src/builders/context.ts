import {
  ApiBuilderService,
  ApiBuilderType,
  isEnclosingType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} from 'apibuilder-js';

import { identity } from 'lodash';

import { Context, InvocationForm, TypeRecord } from './types';

type DependencyRecord = Record<string, Set<string>>;

type Edge = [string, string];

// tslint:disable-next-line: interface-name
interface Node {
  id: string;
  afters: string[];
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

function buildDependencyRecord(types: TypeRecord) {
  return Object.entries(types).reduce<DependencyRecord>(
    (previousValue, [name, type]) => {
      return Object.assign({}, previousValue, {
        [name]: buildDependencyList(type),
      });
    },
    {},
  );
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
  },                                 {});
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
  invocationForm: InvocationForm,
): Context {
  const rootService = new ApiBuilderService(invocationForm.service);
  const importedServices = invocationForm.imported_services.map(_ => new ApiBuilderService(_));
  const allServices = [rootService].concat(importedServices);
  const typesByName = buildTypeRecord(allServices);
  const dependencies = buildDependencyRecord(typesByName);
  const { cyclicTypes, sortedTypes } = topologicalSort(dependencies);

  // Types not included in the topological graph because they are independent.
  // These types can be added at any position in the ordered list.
  const orphanTypes = Object.keys(typesByName).filter(key => !sortedTypes.includes(key));

  // Types not included in the invocation form.
  const unresolvedTypes = sortedTypes.filter(key => typesByName[key] == null);

  return {
    cyclicTypes,
    importedServices,
    rootService,
    sortedTypes: sortedTypes.concat(orphanTypes),
    // tslint:disable-next-line: object-shorthand-properties-first
    typesByName,
    // tslint:disable-next-line: object-shorthand-properties-first
    unresolvedTypes,
  };
}
