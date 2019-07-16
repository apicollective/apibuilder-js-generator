// tslint:disable:object-shorthand-properties-first

import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderField,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderService,
  ApiBuilderType,
  ApiBuilderUnion,
  isArrayType,
  isEnumType,
  isMapType,
  isModelType,
  isPrimitiveType,
  isUnionType,
  Kind,
} from 'apibuilder-js';

import {
  builders as b,
  namedTypes,
} from 'ast-types';

import {
  camelCase,
  identity,
} from 'lodash';

import debug from 'debug';

import { checkIdentifier } from '../../utilities/language';
import { InvocationForm } from './types';

const log = debug('apibuilder:ts_prop_types');

const INDEX_IDENTIFIER = 'T';
const PROP_TYPES_IDENTIFIER = 'PropTypes';

type GeneratableType = ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion;

type PropTypeExpression = namedTypes.CallExpression | namedTypes.MemberExpression;

type PropTypeExpressionBuilder = (
  type: GeneratableType,
  context: Context,
) => PropTypeExpression;

// tslint:disable-next-line:interface-name
interface Context {
  /**
   * This property holds prop type expressions built at runtime indexed by
   * their fully qualified name.
   */
  cache: Record<string, PropTypeExpression>;
  /**
   * This property holds an index of all generatable types derived from the
   * invocation form.
   */
  typesByName: Record<string, GeneratableType>;
  /**
   * This property holds a list of fully qualified name for unresolved types, a
   * type missing in the invocation form. Typically, types in imported services
   * missing their definition.
   */
  unresolvedTypes: string[];
  /**
   * This property holds the fully qualified name for recursive types.
   */
  cyclicTypes: string[];
  /**
   * This property holds an ordered list of fully qualified name for types
   * derived from the invocation form such that all dependencies come before
   * the type in the ordering.
   */
  sortedTypes: GeneratableType[];
}

type Edge = [string, string];

class Node {
  public id: string;
  public afters: string[];

  constructor(id: string) {
    this.id = id;
    this.afters = [];
  }
}

function createDependencyList(type: ApiBuilderType): Set<string> {
  const dependencies = new Set<string>([]);

  function addDependency(dependency: ApiBuilderType) {
    if (isPrimitiveType(dependency)) return;
    if (isArrayType(dependency) || isMapType(dependency)) return addDependency(dependency.ofType);
    dependencies.add(dependency.toString());
  }

  if (isModelType(type)) {
    type.fields.forEach(field => addDependency(field.type));
  } else if (isUnionType(type)) {
    type.types.forEach(unionType => addDependency(unionType.type));
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
  const cyclic: string[] = [];

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
      // as feedback to the generator.
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

function createContext(
  rootService: ApiBuilderService,
  importedServices: ApiBuilderService[],
): Context {
  const allServices = importedServices.concat([rootService]);

  const typesByName: Record<string, GeneratableType> = allServices.reduce(
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
        [key]: createDependencyList(value),
      });
    },
    {},
  );

  const {
    cyclicTypes,
    sortedTypes,
  } = topologicalSort(createEdges(dependencies));

  // Types not included in the topological graph because they are independent.
  // These types can be added at any position in the ordered list.
  const orphanTypes = Object.keys(typesByName)
    .filter(key => !sortedTypes.includes(key));

  // Types not included in the invocation form.
  const unresolvedTypes = sortedTypes.filter(key => typesByName[key] == null);

  return {
    cache: {},
    cyclicTypes,
    sortedTypes: sortedTypes.concat(orphanTypes).map(key => typesByName[key]).filter(Boolean),
    typesByName,
    unresolvedTypes,
  };
}

function stringCompare(s1: string, s2: string) {
  if (s1 > s2) return 1;
  if (s1 < s2) return -1;
  return 0;
}

function shortNameCompare(
  t1: GeneratableType,
  t2: GeneratableType,
) {
  return stringCompare(t1.shortName, t2.shortName);
}

function safeIdentifier(value: string) {
  const feedback = checkIdentifier(value);
  return feedback.es3Warning
    ? `UNSAFE_${value}`
    : value;
}

function needsResolution(
  type: GeneratableType,
): boolean {
  if (isModelType(type)) {
    return type.fields.length === 0;
  }

  if (isEnumType(type)) {
    return type.values.length === 0;
  }

  return type.types.length === 0;
}

function buildSafePropertyKey(value: string) {
  const feedback = checkIdentifier(value);
  return feedback.needsQuotes
    ? b.literal(value)
    : b.identifier(value);
}

/**
 * Higher order function used to automatically cache AST builder results
 */
function withCache(builder: PropTypeExpressionBuilder): PropTypeExpressionBuilder {
  return function builderWithCache(
    type: GeneratableType,
    context: Context,
  ): PropTypeExpression {
    if (context.cache[type.fullName]) {
      return context.cache[type.fullName];
    }

    const expression = builder(type, context);
    context.cache[type.fullName] = expression;
    return expression;
  };
}

/**
 * Higher order function used to automatically resolve incomplete types,
 * typically types from imported services. We need this to avoid creating
 * bad prop type expressions or references for types are not truly available
 * in the context of the generator.
 */
function withResolution(builder: PropTypeExpressionBuilder): PropTypeExpressionBuilder {
  return function builderWithResolution(
    type: GeneratableType,
    context: Context,
  ): PropTypeExpression {
    if (context.unresolvedTypes.includes(type.fullName)) {
      return buildAnyPropTypeExpression();
    }

    const resolvedType = needsResolution(type) ? context.typesByName[type.fullName] : type;
    return builder(resolvedType, context);
  };
}

function buildTypeIdentifier(
  type: GeneratableType,
): namedTypes.Identifier {
  const identifier = safeIdentifier(camelCase(type.shortName));
  return b.identifier(identifier);
}

function buildTypeExpressionStatement(
  type: GeneratableType,
  context: Context,
): namedTypes.ExpressionStatement {
  return b.expressionStatement(
    b.assignmentExpression(
      '=',
      b.memberExpression(
        b.identifier(INDEX_IDENTIFIER),
        b.literal(type.fullName),
        true,
      ),
      buildPropTypeExpression(type, context),
    ),
  );
}

function buildAnyPropTypeExpression() {
  return b.memberExpression(
    b.identifier(PROP_TYPES_IDENTIFIER),
    b.identifier('any'),
  );
}

function buildPrimitivePropTypeExpression(
  type: ApiBuilderPrimitiveType,
): PropTypeExpression {
  switch (type.shortName) {
    case Kind.STRING:
    case Kind.DATE_ISO8601:
    case Kind.DATE_TIME_ISO8601:
    case Kind.UUID:
    case Kind.JSON:
      return b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('string'),
      );
    case Kind.BOOLEAN:
      return b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('bool'),
      );
    case Kind.DECIMAL:
    case Kind.DOUBLE:
    case Kind.INTEGER:
    case Kind.LONG:
      return b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('number'),
      );
    case Kind.OBJECT:
      return b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('object'),
      );
    default:
      return buildAnyPropTypeExpression();
  }
}

function buildArrayPropTypeExpression(
  type: ApiBuilderArray,
  context: Context,
): PropTypeExpression {
  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('arrayOf'),
    ),
    [buildPropTypeExpression(type.ofType, context)],
  );
}

function buildMapPropTypeExpression(
  type: ApiBuilderMap,
  context: Context,
): PropTypeExpression {
  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('objectOf'),
    ),
    [buildPropTypeExpression(type.ofType, context)],
  );
}

const buildEnumPropTypeExpression = withResolution(withCache((
  enumeration: ApiBuilderEnum,
): PropTypeExpression => {
  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('oneOf'),
    ),
    [b.arrayExpression(
      enumeration.values.map(value => b.literal(value.name)),
    )],
  );
}));

const buildModelPropTypeExpression = withResolution(withCache((
  model: ApiBuilderModel,
  context: Context,
): PropTypeExpression => {
  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('exact'),
    ),
    [b.objectExpression(
      model.fields.map(field => b.property(
        'init',
        buildSafePropertyKey(field.name),
        buildFieldPropTypeExpression(field, context),
      )),
    )],
  );
}));

const buildUnionPropTypeExpression = withResolution(withCache((
  union: ApiBuilderUnion,
  context: Context,
): PropTypeExpression => {
  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('oneOfType'),
    ),
    [b.arrayExpression(
      union.types.map((unionType) => {
        const discriminator = b.property(
          'init',
          buildSafePropertyKey(union.discriminator),
          b.memberExpression(
            b.callExpression(
              b.memberExpression(
                b.identifier(PROP_TYPES_IDENTIFIER),
                b.identifier('oneOf'),
              ),
              [b.arrayExpression([
                b.stringLiteral(unionType.discriminatorValue),
              ])],
            ),
            b.identifier('isRequired'),
          ),
        );

        if (isModelType(unionType.type)) {
          return b.callExpression(
            b.memberExpression(
              b.identifier(PROP_TYPES_IDENTIFIER),
              b.identifier('exact'),
            ),
            [b.objectExpression([
              discriminator,
              ...unionType.type.fields.map(field => b.property(
                'init',
                buildSafePropertyKey(field.name),
                buildFieldPropTypeExpression(
                  field,
                  context,
                ),
              )),
            ])],
          );
        }

        if (isEnumType(unionType.type)) {
          return b.callExpression(
            b.memberExpression(
              b.identifier(PROP_TYPES_IDENTIFIER),
              b.identifier('exact'),
            ),
            [b.objectExpression([
              discriminator,
              b.property(
                'init',
                b.identifier('value'),
                buildEnumPropTypeExpression(unionType.type, context),
              ),
            ])],
          );
        }

        if (isPrimitiveType(unionType.type)) {
          return b.callExpression(
            b.memberExpression(
              b.identifier(PROP_TYPES_IDENTIFIER),
              b.identifier('exact'),
            ),
            [b.objectExpression([
              discriminator,
              b.property(
                'init',
                b.identifier('value'),
                buildPrimitivePropTypeExpression(unionType.type),
              ),
            ])],
          );
        }

        throw TypeError(
          `The provided union type (${unionType.toString()}) refers to an ` +
          'invalid type. An union type may only refer to an enum, model, or '
          + 'primitive type.',
        );
      }),
    )],
  );
}));

function buildFieldPropTypeExpression(
  field: ApiBuilderField,
  context: Context,
) {
  const expression = buildPropTypeReferenceExpression(field.type, context);
  return field.isRequired
    ? b.memberExpression(expression, b.identifier('isRequired'))
    : expression;
}

function buildEnumVariableDeclaration(
  enumeration: ApiBuilderEnum,
  context: Context,
): namedTypes.VariableDeclaration {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      buildTypeIdentifier(enumeration),
      buildEnumPropTypeExpression(enumeration, context),
    )],
  );
}

function buildModelVariableDeclaration(
  model: ApiBuilderModel,
  context: Context,
): namedTypes.VariableDeclaration {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      buildTypeIdentifier(model),
      buildModelPropTypeExpression(model, context),
    )],
  );
}

function buildUnionVariableDeclaration(
  union: ApiBuilderUnion,
  context: Context,
): namedTypes.VariableDeclaration {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      buildTypeIdentifier(union),
      buildUnionPropTypeExpression(union, context),
    )],
  );
}

function buildPropTypeReferenceExpression(
  type: ApiBuilderType,
  context: Context,
): namedTypes.MemberExpression | namedTypes.CallExpression {
  if (isPrimitiveType(type)) {
    return buildPrimitivePropTypeExpression(type);
  }

  if (isArrayType(type)) {
    return b.callExpression(
      b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('arrayOf'),
      ),
      [buildPropTypeReferenceExpression(type.ofType, context)],
    );
  }

  if (isMapType(type)) {
    return b.callExpression(
      b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('objectOf'),
      ),
      [buildPropTypeReferenceExpression(type.ofType, context)],
    );
  }

  if (context.cyclicTypes.includes(type.fullName)) {
    return buildAnyPropTypeExpression();
  }

  if (context.unresolvedTypes.includes(type.fullName)) {
    return buildAnyPropTypeExpression();
  }

  return b.memberExpression(
    b.identifier(INDEX_IDENTIFIER),
    b.literal(type.fullName),
    true,
  );
}

function buildPropTypeExpression(
  type: ApiBuilderType,
  context: Context,
): namedTypes.MemberExpression | namedTypes.CallExpression {
  if (isPrimitiveType(type)) {
    return buildPrimitivePropTypeExpression(type);
  }

  if (isArrayType(type)) {
    return buildArrayPropTypeExpression(type, context);
  }

  if (isMapType(type)) {
    return buildMapPropTypeExpression(type, context);
  }

  if (isEnumType(type)) {
    return buildEnumPropTypeExpression(type, context);
  }

  if (isModelType(type)) {
    return buildModelPropTypeExpression(type, context);
  }

  if (isUnionType(type)) {
    return buildUnionPropTypeExpression(type, context);
  }

  return buildAnyPropTypeExpression();
}

function buildTypeExportNamedDeclaration(
  type: GeneratableType,
  context: Context,
) {
  return b.exportNamedDeclaration(
    b.variableDeclaration(
      'const',
      [b.variableDeclarator(
        buildTypeIdentifier(type),
        buildPropTypeReferenceExpression(type, context),
      )],
    ),
  );
}

export function buildFile(invocationForm: InvocationForm) {
  const service = new ApiBuilderService(invocationForm.service);

  const importedServices = invocationForm.imported_services != null
    ? invocationForm.imported_services.map(_ => new ApiBuilderService(_))
    : [];

  const context = createContext(service, importedServices);

  const {
    cyclicTypes,
    sortedTypes,
    unresolvedTypes,
  } = context;

  if (unresolvedTypes.length) {
    log(
      'WARN: the following types could not be resolved and will be ignored: '
      + `${JSON.stringify(unresolvedTypes)}`,
    );
  }

  if (cyclicTypes.length) {
    log(
      'WARN: the following types are cyclic and will be ignored: '
      + `${JSON.stringify(cyclicTypes)}`);
  }

  const ast = b.file(b.program([
    b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier(PROP_TYPES_IDENTIFIER))],
      b.literal('prop-types'),
    ),
    b.variableDeclaration(
      'const',
      [b.variableDeclarator(
        b.identifier(INDEX_IDENTIFIER),
        b.objectExpression([]),
      )],
    ),
    ...sortedTypes.map(type => buildTypeExpressionStatement(type, context)),
    ...[
      ...service.enums,
      ...service.models,
      ...service.unions,
    ].sort(shortNameCompare).map(type => buildTypeExportNamedDeclaration(type, context)),
  ]));

  return ast;
}
