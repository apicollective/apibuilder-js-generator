// tslint:disable:object-shorthand-properties-first

import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderField,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
  isArrayType,
  isEnumType,
  isMapType,
  isModelType,
  isPrimitiveType,
  Kind,
} from 'apibuilder-js';
import { builders as b, namedTypes } from 'ast-types';
import debug from 'debug';
import { camelCase } from 'lodash';
import { Context } from '../../builders';
import { checkIdentifier } from '../../utilities/language';

const log = debug('apibuilder:ts_prop_types');

const PROP_TYPES_IDENTIFIER = 'PropTypes';

type PropTypeExpression =
  | namedTypes.CallExpression
  | namedTypes.MemberExpression
  | namedTypes.Identifier;

type PropTypeExpressionBuilder = (
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  context: Context,
) => PropTypeExpression;

export function safeIdentifier(value: string) {
  const feedback = checkIdentifier(value);
  return feedback.es3Warning
    ? `UNSAFE_${value}`
    : value;
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
  const cache = {};
  return function builderWithCache(
    type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
    context: Context,
  ): PropTypeExpression {
    if (cache[type.fullName]) {
      return cache[type.fullName];
    }

    const expression = builder(type, context);
    cache[type.fullName] = expression;
    return expression;
  };
}

/**
 * Higher order function used to automatically return a reference for
 * generated prop type declarations.
 */
function withReference(
  builder: PropTypeExpressionBuilder,
): PropTypeExpressionBuilder {
  const referenceable = {};
  return function buildWithReference(
    type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
    context: Context,
  ): PropTypeExpression {
    if (referenceable[type.fullName]) {
      return buildPropTypeReference(type, context);
    }

    const expression = builder(type, context);
    referenceable[type.fullName] = true;
    return expression;
  };
}

export function buildTypeIdentifier(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): namedTypes.Identifier {
  const identifier = safeIdentifier(camelCase(type.shortName));
  return b.identifier(identifier);
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

const buildEnumPropTypeExpression = withReference(withCache((
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

const buildModelPropTypeExpression = withReference(withCache((
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

const buildUnionPropTypeExpression = withReference(withCache((
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
  const expression = buildPropTypeReference(field.type, context);
  return field.isRequired
    ? b.memberExpression(expression, b.identifier('isRequired'))
    : expression;
}

function buildPropTypeReference(
  type: ApiBuilderType,
  context: Context,
): namedTypes.MemberExpression | namedTypes.CallExpression | namedTypes.Identifier {
  const {
    cyclicTypes,
    unresolvedTypes,
  } = context;

  if (isPrimitiveType(type)) {
    return buildPrimitivePropTypeExpression(type);
  }

  if (isArrayType(type)) {
    return b.callExpression(
      b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('arrayOf'),
      ),
      [buildPropTypeReference(type.ofType, context)],
    );
  }

  if (isMapType(type)) {
    return b.callExpression(
      b.memberExpression(
        b.identifier(PROP_TYPES_IDENTIFIER),
        b.identifier('objectOf'),
      ),
      [buildPropTypeReference(type.ofType, context)],
    );
  }

  if (cyclicTypes.includes(type.fullName)) {
    return buildAnyPropTypeExpression();
  }

  if (unresolvedTypes.includes(type.fullName)) {
    return buildAnyPropTypeExpression();
  }

  return buildTypeIdentifier(type);
}

function buildPropTypeExpression(
  type: ApiBuilderType,
  context: Context,
): PropTypeExpression {
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

  return buildUnionPropTypeExpression(type, context);
}

function buildPropTypeDeclaration(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  context: Context,
) {
  const variable = b.variableDeclaration('const', [
    b.variableDeclarator(
      buildTypeIdentifier(type),
      buildPropTypeExpression(type, context),
    ),
  ]);

  if (type.packageName.startsWith(context.rootService.namespace)) {
    return b.exportNamedDeclaration(variable);
  }

  return variable;
}

export function buildFile(context: Context) {
  const {
    cyclicTypes,
    sortedTypes,
    typesByName,
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
      'WARN: the following types are circular and will be ignored: '
      + `${JSON.stringify(cyclicTypes)}`,
    );
  }

  const declarations = sortedTypes
    .filter(name => !unresolvedTypes.includes(name))
    .map(name => typesByName[name])
    .map(type => buildPropTypeDeclaration(type, context));

  const ast = b.file(b.program([
    b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier(PROP_TYPES_IDENTIFIER))],
      b.literal('prop-types'),
    ),
    ...declarations,
  ]));

  return ast;
}
