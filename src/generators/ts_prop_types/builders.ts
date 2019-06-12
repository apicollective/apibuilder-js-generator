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
  builders as b, namedTypes,
} from 'ast-types';

import {
  ExpressionKind,
} from 'ast-types/gen/kinds';

import {
  camelCase,
} from 'lodash';

import debug from 'debug';

import {
  checkIdentifier,
} from '../../utilities/language';

const log = debug('apibuilder:ts_prop_types');

// tslint:disable-next-line:interface-name
interface Context {
  /**
   * This property holds the service being generated
   */
  service: ApiBuilderService;
  /**
   * This property holds the imported services for the service being generated
   */
  importedServices: ApiBuilderService[];
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

function safeIdentifier(value: string) {
  const feedback = checkIdentifier(value);
  return feedback.es3Warning
    ? `RESERVED_WORD_${value}`
    : value;
}

function needsResolution(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): boolean {
  if (isModelType(type)) {
    return type.fields.length === 0;
  }

  if (isEnumType(type)) {
    return type.values.length === 0;
  }

  return type.types.length === 0;
}

function resolveApiBuilderType(
  type: ApiBuilderEnum,
  context: Context,
): ApiBuilderEnum | undefined;

function resolveApiBuilderType(
  type: ApiBuilderModel,
  context: Context,
): ApiBuilderModel | undefined;

function resolveApiBuilderType(
  type: ApiBuilderUnion,
  context: Context,
): ApiBuilderUnion | undefined;

function resolveApiBuilderType(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  context: Context,
): ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion | undefined {
  if (!needsResolution(type)) {
    return type;
  }

  const service = context.importedServices.find(
    importedService => type.packageName.startsWith(importedService.namespace,
  ));

  const resolvedType = service != null
    ? service.findTypeByName(type.fullName)
    : undefined;

  if (resolvedType != null) {
    return resolvedType;
  }

  if (!context.unknownTypes.includes(type.fullName)) {
    context.unknownTypes.push(type.fullName);
  }

  return undefined;
}

function buildSafePropertyKey(value: string) {
  const feedback = checkIdentifier(value);
  return feedback.needsQuotes
    ? b.identifier(value)
    : b.literal(value);
}

function isCyclic(
  sourceType: ApiBuilderType,
  targetType: ApiBuilderType,
  checkedTypes: { [key: string]: true } = {},
): boolean {
  // condition to avoid infinite loop
  if (checkedTypes[targetType.toString()]) {
    return false;
  }

  // primitive types do not introduce cyclic dependencies
  if (isPrimitiveType(sourceType) || isPrimitiveType(targetType)) {
    return false;
  }

  // self references
  if (sourceType.toString() === targetType.toString()) {
    return true;
  }

  if (isModelType(targetType)) {
    return targetType.fields.some(field => isCyclic(sourceType, field.type, {
      ...checkedTypes,
      [targetType.toString()]: true,
    }));
  }

  if (isUnionType(targetType)) {
    return targetType.types.some(unionType => isCyclic(sourceType, unionType.type, {
      ...checkedTypes,
      [targetType.toString()]: true,
    }));
  }

  if (isArrayType(targetType) || isMapType(targetType)) {
    return isCyclic(sourceType, targetType.ofType, {
      ...checkedTypes,
      [targetType.toString()]: true,
    });
  }

  return false;
}

/**
 * Returns identifier name to be used in named export declarations for the
 * provided API Builder type.
 * @param type
 */
export function buildApiBuilderTypeIdentifier(
  type: ApiBuilderEnum | ApiBuilderUnion | ApiBuilderModel,
) {
  return b.identifier(
    safeIdentifier(camelCase(type.shortName)),
  );
}

export function buildApiBuilderPrimitivePropTypeExpression(
  type: ApiBuilderPrimitiveType,
) {
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

export function buildApiBuilderArrayPropTypeExpression(
  type: ApiBuilderArray,
  context: Context,
): namedTypes.CallExpression {
  return b.callExpression(
    b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('arrayOf'),
    ),
    [buildApiBuilderPropTypeExpression(type.ofType, context)],
  );
}

export function buildApiBuilderMapPropTypeExpression(
  type: ApiBuilderMap,
  context: Context,
): namedTypes.CallExpression {
  return b.callExpression(
    b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('objectOf'),
    ),
    [buildApiBuilderPropTypeExpression(type.ofType, context)],
  );
}

export function buildApiBuilderEnumPropTypeExpression(
  enumeration: ApiBuilderEnum | undefined,
) {
  if (enumeration == null) {
    return b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('any'),
    );
  }

  return b.callExpression(
    b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('oneOf'),
    ),
    [b.arrayExpression(
      enumeration.values.map(value => b.literal(value.name)),
    )],
  );
}

export function buildApiBuilderFieldPropTypeExpression(
  field: ApiBuilderField,
  model: ApiBuilderModel,
  context: Context,
) {
  let expression: ExpressionKind = b.memberExpression(
    b.identifier('propTypes'),
    b.identifier('any'),
  );

  if (!isCyclic(model, field.type)) {
    expression = buildApiBuilderPropTypeExpression(field.type, context);
  } else {
    if (!context.cyclicTypes.includes(field.type.toString())) {
      context.cyclicTypes.push(field.type.toString());
    }
  }

  return field.isRequired
    ? b.memberExpression(expression, b.identifier('isRequired'))
    : expression;
}

export function buildApiBuilderEnumDeclaration(
  enumeration: ApiBuilderEnum,
) {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      buildApiBuilderTypeIdentifier(enumeration),
      buildApiBuilderEnumPropTypeExpression(enumeration),
    )],
  );
}

export function buildApiBuilderModelDeclaration(
  model: ApiBuilderModel,
  context: Context,
) {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      buildApiBuilderTypeIdentifier(model),
      buildApiBuilderModelPropTypeExpression(model, context),
    )],
  );
}

export function buildApiBuilderUnionDeclaration(
  union: ApiBuilderUnion,
  context: Context,
) {
  return b.variableDeclaration(
    'const',
    [b.variableDeclarator(
      buildApiBuilderTypeIdentifier(union),
      buildApiBuilderUnionPropTypeExpression(union, context),
    )],
  );
}

export function buildApiBuilderModelPropTypeExpression(
  model: ApiBuilderModel | undefined,
  context: Context,
): ExpressionKind {
  if (model == null) {
    return b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('any'),
    );
  }

  return b.callExpression(
    b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('exact'),
    ),
    [b.objectExpression(
      model.fields.map(field => b.property(
        'init',
        buildSafePropertyKey(field.name),
        buildApiBuilderFieldPropTypeExpression(field, model, context),
      )),
    )],
  );
}

export function buildApiBuilderUnionPropTypeExpression(
  union: ApiBuilderUnion | undefined,
  context: Context,
) {
  if (union == null) {
    return b.memberExpression(
      b.identifier('propTypes'),
      b.identifier('any'),
    );
  }

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
                buildApiBuilderFieldPropTypeExpression(
                  field,
                  unionType.type as ApiBuilderModel,
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
                buildApiBuilderEnumPropTypeExpression(unionType.type),
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
                buildApiBuilderPrimitivePropTypeExpression(unionType.type),
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

export function buildApiBuilderPropTypeExpression(
  type: ApiBuilderType,
  context: Context,
): ExpressionKind {
  if (isPrimitiveType(type)) {
    return buildApiBuilderPrimitivePropTypeExpression(type);
  }

  if (isArrayType(type)) {
    return buildApiBuilderArrayPropTypeExpression(type, context);
  }

  if (isMapType(type)) {
    return buildApiBuilderMapPropTypeExpression(type, context);
  }

  if (isEnumType(type)) {
    return buildApiBuilderEnumPropTypeExpression(
      resolveApiBuilderType(type, context),
    );
  }

  if (isModelType(type)) {
    return buildApiBuilderModelPropTypeExpression(
      resolveApiBuilderType(type, context),
      context,
    );
  }

  if (isUnionType(type)) {
    return buildApiBuilderUnionPropTypeExpression(
      resolveApiBuilderType(type, context),
      context,
    );
  }

  return b.memberExpression(
    b.identifier('propTypes'),
    b.identifier('any'),
  );
}

export function buildExportNameDeclaration(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  context: Context,
) {
  let declaration;

  log(`DEBUG: Building AST declaration for ${type.fullName}`);

  if (isEnumType(type)) {
    declaration = buildApiBuilderEnumDeclaration(type);
  } else if (isModelType(type)) {
    declaration = buildApiBuilderModelDeclaration(type, context);
  } else {
    declaration = buildApiBuilderUnionDeclaration(type, context);
  }

  return b.exportNamedDeclaration(declaration);

}

export function buildFile(
  service: ApiBuilderService,
  importedServices: ApiBuilderService[] = [],
) {
  const context: Context = {
    cyclicTypes: [],
    importedServices,
    service,
    unknownTypes: [],
  };

  const typeDeclarations = [
    ...service.enums,
    ...service.models,
    ...service.unions,
  ]
    .sort(shortNameCompare)
    .map(type => buildExportNameDeclaration(type, context));

  const ast = b.file(b.program([
    b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier('propTypes'))],
      b.literal('prop-types'),
    ),
    ...typeDeclarations,
  ]));

  if (context.unknownTypes.length) {
    log(`WARN: the following types were unknown: ${JSON.stringify(context.unknownTypes)}.`);
  }

  if (context.cyclicTypes.length) {
    log(`WARN: the following types were cyclic: ${JSON.stringify(context.cyclicTypes)}`);
  }

  return ast;
}
