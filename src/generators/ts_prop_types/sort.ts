import { identity } from 'lodash';

import {
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderService,
  ApiBuilderType,
  ApiBuilderUnion,
  isEnclosingType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} from 'apibuilder-js';

type GeneratableType = ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion;

type Edge = [string, string];

class Node {
  public id: string;
  public afters: string[];

  constructor(id: string) {
    this.id = id;
    this.afters = [];
  }
}

function createDependencies(type: ApiBuilderType): Set<string> {
  const dependencies = new Set<string>([]);

  function addDependency(dependency: ApiBuilderType) {
    if (isPrimitiveType(dependency)) {
      return;
    }

    if (isEnclosingType(dependency)) {
      return addDependency(dependency.ofType);
    }

    dependencies.add(dependency.toString());
  }

  if (isModelType(type)) {
    type.fields.forEach((field) => {
      addDependency(field.type);
    });
  } else if (isUnionType(type)) {
    type.types.forEach((unionType) => {
      addDependency(unionType.type);
    });
  }

  return dependencies;
}

function createEdges(
  dependencies: Record<string, Set<string>>,
): Edge[] {
  const edges = [];
  Object.keys(dependencies).forEach((dependent) => {
    dependencies[dependent].forEach((dependency) => {
      edges.push([dependency, dependent]);
    });
  });
  return edges;
}

function topologicalSort(edges: Edge[]) {
  const nodes: Record<string, Node> = {};
  const sorted: string[] = [];
  const visited: Record<string, boolean> = {};

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
      // the order ambiguous. We should probably throw an error, but we are
      // going to close our eyes and ignore this...
      if (!ancestors.includes(afterId)) {
        visit(afterId.toString(), ancestors.map(identity));
      }
    });

    sorted.unshift(id);
  }

  Object.keys(nodes).forEach((key) => {
    visit(key);
  });

  return sorted;
}

/**
 * Returns an ordered list of types such that for every type its dependencies
 * come before it in the ordering.
 */
export function sortTypes(
  services: ApiBuilderService[],
): GeneratableType[] {
  const typesByName: Record<string, GeneratableType> = services.reduce(
    (result, service) => {
      service.enums.forEach(enumeration => result[enumeration.toString()] = enumeration);
      service.models.forEach(model => result[model.toString()] = model);
      service.unions.forEach(union => result[union.toString()] = union);
      return result;
    },
    {},
  );

  const dependencies = Object.entries(typesByName).reduce(
    (previousValue, [key, value]) => {
      return Object.assign(previousValue, {
        [key]: createDependencies(value),
      });
    },
    // Add root to avoid orphan nodes for independent types
    { __ROOT__: new Set(Object.keys(typesByName)) },
  );

  const edges = createEdges(dependencies);
  const sortedTypes = topologicalSort(edges);

  return sortedTypes.map(typeName => typesByName[typeName]).filter(Boolean);
}
