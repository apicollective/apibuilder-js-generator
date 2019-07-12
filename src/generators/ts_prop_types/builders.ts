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
} from 'lodash';

import debug from 'debug';

import { checkIdentifier } from '../../utilities/language';
import { sortTypes } from './sort';

const log = debug('apibuilder:ts_prop_types');

type GeneratableType = ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion;

type PropTypeExpression = namedTypes.CallExpression | namedTypes.MemberExpression;

// tslint:disable-next-line:interface-name
interface Context {
  /**
   * This property holds prop type expressions built at runtime indexed by
   * their fully qualified name.
   */
  cache: { [key: string]: PropTypeExpression };
  /**
   * This property holds the service being generated
   */
  service: ApiBuilderService;
  /**
   * This property holds the imported services for the service being generated
   */
  importedServices: ApiBuilderService[];
  /**
   * This property holds a list of fully qualified name for types that are
   * available to be generated.
   */
  knownTypes: string[];
  /**
   * This property holds the fully qualified name for types that could not be
   * resolved from invocation form at runtime.
   */
  unknownTypes: string[];
  /**
   * This property holds the fully qualified name for types that could not be
   * generated because of their recursive nature
   */
  cyclicTypes: string[];
}

type PropTypeExpressionBuilder = (
  type: GeneratableType,
  context: Context,
) => PropTypeExpression;

function isGeneratableType(type: any): type is GeneratableType {
  return isEnumType(type) || isModelType(type) || isUnionType(type);
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
    if (!needsResolution(type)) {
      return builder(type, context);
    }

    const service = context.importedServices.find(
      importedService => type.packageName.startsWith(importedService.namespace),
    );

    const resolvedType = service != null
      ? service.findTypeByName(type.fullName)
      : undefined;

    if (resolvedType != null) {
      return builder(resolvedType, context);
    }

    context.unknownTypes.push(type.toString());
    return b.memberExpression(b.identifier('propTypes'), b.identifier('any'));
  };
}

function buildNestedMemberExpression(
  identifiers: namedTypes.Identifier[],
  expression?: namedTypes.MemberExpression,
): namedTypes.MemberExpression {
  if (!identifiers.length) return expression;
  const object = expression != null ? expression : identifiers.shift();
  const property = identifiers.shift();
  return buildNestedMemberExpression(identifiers, b.memberExpression(object, property));
}

function buildTypeIdentifier(
  type: GeneratableType,
): namedTypes.Identifier {
  const identifier = safeIdentifier(camelCase(type.shortName));
  return b.identifier(identifier);
}

function buildModuleDeclaration(
  identifiers: namedTypes.Identifier[],
  body: namedTypes.TSModuleDeclaration,
): namedTypes.TSModuleDeclaration {
  if (!identifiers.length) return body;
  const id = identifiers.pop();
  const declaration = b.tsModuleDeclaration(id, body);
  return buildModuleDeclaration(identifiers, declaration);
}

function buildTypeModuleDeclaration(
  types: (GeneratableType)[],
  context: Context,
): namedTypes.TSModuleDeclaration {
  // ensure all types are within the same package name
  const packageNames = types
    .map(type => type.packageName)
    .filter((value, index, self) => self.indexOf(value) === index);

  if (packageNames.length > 1) {
    throw new Error(`Cannot declare namespace for types in different packages: ${packageNames}`);
  }

  const declarations = types.map(type => buildTypeExportNamedDeclaration(type, context));

  const identifiers = packageNames
    .shift()
    .split('.')
    .map(camelCase)
    .map(safeIdentifier)
    .map(b.identifier);

  const declaration = b.tsModuleDeclaration(
    identifiers.pop(),
    b.tsModuleBlock(declarations),
  );

  return buildModuleDeclaration(identifiers, declaration);
}

function buildTypeModuleDeclarations(
  types: (GeneratableType)[],
  context: Context,
  declarations: namedTypes.TSModuleDeclaration[] = [],
): namedTypes.TSModuleDeclaration[] {
  if (!types.length) return declarations;

  const index = types
    .map(type => type.packageName)
    .findIndex((value, _, self) => self.indexOf(value) > 0);

  const deleteCount = index >= 0 ? index : types.length;

  const chunk = types.splice(0, deleteCount);

  return buildTypeModuleDeclarations(
    types,
    context,
    declarations.concat(buildTypeModuleDeclaration(chunk, context)),
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
        b.identifier('propTypes'),
        b.identifier('string'),
      );
    case Kind.BOOLEAN:
      return b.memberExpression(
        b.identifier('propTypes'),
        b.identifier('bool'),
      );
    case Kind.DECIMAL:
    case Kind.DOUBLE:
    case Kind.INTEGER:
    case Kind.LONG:
      return b.memberExpression(
        b.identifier('propTypes'),
        b.identifier('number'),
      );
    case Kind.OBJECT:
      return b.memberExpression(
        b.identifier('propTypes'),
        b.identifier('object'),
      );
    default:
      return b.memberExpression(
        b.identifier('propTypes'),
        b.identifier('any'),
      );
  }
}

function buildArrayPropTypeExpression(
  type: ApiBuilderArray,
  context: Context,
): PropTypeExpression {
  return b.callExpression(
    b.memberExpression(
      b.identifier('propTypes'),
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
      b.identifier('propTypes'),
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
      b.identifier('propTypes'),
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
      b.identifier('propTypes'),
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
      b.identifier('propTypes'),
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
                b.identifier('propTypes'),
                b.identifier('oneOf'),
              ),
              [b.arrayExpression([
                b.tsAsExpression(
                  b.stringLiteral(unionType.discriminatorValue),
                  b.tsLiteralType(
                    b.stringLiteral(unionType.discriminatorValue),
                  ),
                ),
              ])],
            ),
            b.identifier('isRequired'),
          ),
        );

        if (isModelType(unionType.type)) {
          return b.callExpression(
            b.memberExpression(
              b.identifier('propTypes'),
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
              b.identifier('propTypes'),
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
              b.identifier('propTypes'),
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

const buildGeneratablePropTypeReferenceExpression = withResolution((type) => {
  const identifiers = type.packageName
    .split('.')
    .concat(type.shortName)
    .map(camelCase)
    .map(safeIdentifier)
    .map(b.identifier);

  return buildNestedMemberExpression(identifiers);
});

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
        b.identifier('propTypes'),
        b.identifier('arrayOf'),
      ),
      [buildPropTypeReferenceExpression(type.ofType, context)],
    );
  }

  if (isMapType(type)) {
    return b.callExpression(
      b.memberExpression(
        b.identifier('propTypes'),
        b.identifier('objectOf'),
      ),
      [buildPropTypeReferenceExpression(type.ofType, context)],
    );
  }

  return buildGeneratablePropTypeReferenceExpression(type, context);
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

  return b.memberExpression(
    b.identifier('propTypes'),
    b.identifier('any'),
  );
}

function buildTypeExportNamedDeclaration(
  type: GeneratableType,
  context: Context,
): namedTypes.ExportNamedDeclaration {
  if (isEnumType(type)) {
    return b.exportNamedDeclaration(
      buildEnumVariableDeclaration(type, context),
    );
  }

  if (isModelType(type)) {
    return b.exportNamedDeclaration(
      buildModelVariableDeclaration(type, context),
    );
  }

  return b.exportNamedDeclaration(
    buildUnionVariableDeclaration(type, context),
  );
}

function buildTypeAliasExportNamedDeclaration(
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

export function buildFile(
  service: ApiBuilderService,
  importedServices: ApiBuilderService[] = [],
) {
  const sortedTypes = sortTypes(importedServices.concat(service));

  const context: Context = {
    cache: {},
    cyclicTypes: [],
    importedServices,
    knownTypes: sortedTypes.map(type => type.fullName),
    service,
    unknownTypes: [],
  };

  const declarations = buildTypeModuleDeclarations(sortedTypes, context);

  const aliases = [
    ...service.enums,
    ...service.models,
    ...service.unions,
  ].sort(shortNameCompare).map(type => buildTypeAliasExportNamedDeclaration(type, context));

  const ast = b.file(b.program([
    b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier('propTypes'))],
      b.literal('prop-types'),
    ),
    ...declarations,
    ...aliases,
  ]));

  if (context.unknownTypes.length) {
    log(`WARN: the following types were unknown: ${JSON.stringify(context.unknownTypes)}.`);
  }

  if (context.cyclicTypes.length) {
    log(`WARN: the following types were cyclic: ${JSON.stringify(context.cyclicTypes)}`);
  }

  return ast;
}
