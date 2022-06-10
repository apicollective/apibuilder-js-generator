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

const INDEX_IDENTIFIER = 'T';
const PROP_TYPES_IDENTIFIER = 'PropTypes';

type PropTypeExpression =
  | namedTypes.CallExpression
  | namedTypes.MemberExpression
  | namedTypes.Identifier;

type PropTypeExpressionBuilder = (
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  context: Context,
) => PropTypeExpression;

function stringCompare(s1: string, s2: string) {
  if (s1 > s2) return 1;
  if (s1 < s2) return -1;
  return 0;
}

function shortNameCompare(
  t1: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  t2: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
) {
  return stringCompare(t1.shortName, t2.shortName);
}

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

function buildEnumPropTypeExpression(
  enumeration: ApiBuilderEnum,
): PropTypeExpression {
  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('oneOf'),
    ),
    [b.arrayExpression(
      enumeration.values.map(value => b.literal(value.value)),
    )],
  );
}

function buildModelPropTypeExpression(
  model: ApiBuilderModel,
  context: Context,
): PropTypeExpression {
  const { discriminator, discriminatorValue, fields } = model;
  const properties: namedTypes.Property[] = [];

  if (discriminator != null && discriminatorValue != null) {
    properties.push(b.property(
      'init',
      buildSafePropertyKey(discriminator),
      b.memberExpression(
        b.callExpression(
          b.memberExpression(
            b.identifier(PROP_TYPES_IDENTIFIER),
            b.identifier('oneOf'),
          ),
          [b.arrayExpression([
            b.stringLiteral(discriminatorValue),
          ])],
        ),
        b.identifier('isRequired'),
      ),
    ));
  }

  fields.forEach((field) => {
    properties.push(b.property(
      'init',
      buildSafePropertyKey(field.name),
      buildFieldPropTypeExpression(field, context),
    ));
  });

  return b.callExpression(
    b.memberExpression(
      b.identifier(PROP_TYPES_IDENTIFIER),
      b.identifier('exact'),
    ),
    [b.objectExpression(properties)],
  );
}

function buildUnionPropTypeExpression(
  union: ApiBuilderUnion,
  context: Context,
): PropTypeExpression {
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
          return buildPropTypeReference(unionType.type, context);
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
                buildPropTypeReference(unionType.type, context),
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
}

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
): PropTypeExpression {
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

  return b.memberExpression(
    b.identifier(INDEX_IDENTIFIER),
    b.literal(type.fullName),
    true,
  );
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
    return buildEnumPropTypeExpression(type);
  }

  if (isModelType(type)) {
    return buildModelPropTypeExpression(type, context);
  }

  return buildUnionPropTypeExpression(type, context);
}

function buildPropTypeStatement(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
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

function buildTypeExportNamedDeclaration(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  context: Context,
) {
  const variable = b.variableDeclaration('const', [
    b.variableDeclarator(
      buildTypeIdentifier(type),
      buildPropTypeReference(type, context),
    ),
  ]);

  return b.exportNamedDeclaration(variable);
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

  const statements = sortedTypes
    .filter(name => !unresolvedTypes.includes(name))
    .map(name => typesByName[name])
    .map(type => buildPropTypeStatement(type, context));

  const declarations = [
    ...context.rootService.enums,
    ...context.rootService.models,
    ...context.rootService.unions,
  ]
    .sort(shortNameCompare)
    .map(type => buildTypeExportNamedDeclaration(type, context));

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
    ...statements,
    ...declarations,
  ]));

  return ast;
}
