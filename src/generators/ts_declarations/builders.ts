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
} from 'ast-types';

import {
  TSTypeAnnotationKind,
  TSTypeKind,
} from 'ast-types/gen/kinds';

import {
  camelCase,
  upperFirst,
} from 'lodash';

/**
 * Converts `value` to pascal case.
 * @param value
 */
function pascalCase(value: string) {
  return upperFirst(camelCase(value));
}

/**
 * Returns whether `enumeration` is not an imported enum.
 * @param enumeration
 */
function isInternalEnum(enumeration: ApiBuilderEnum) {
  // API Builder does not fully resolve imported types,
  // therefore only imported enums lack values.
  return enumeration.values.length > 0;
}

/**
 * Returns whether `model` is not an imported model.
 * @param model
 */
function isInternalModel(model: ApiBuilderModel) {
  // API Builder does not fully resolve imported types,
  // therefore only imported models lack fields.
  return model.fields.length > 0;
}

/**
 * Returns whether `union` is not an imported union.
 * @param union
 */
function isInternalUnion(union: ApiBuilderUnion) {
  // API Builder does not fully resolve imported types,
  // therefore only imported unions lack union types.
  return union.types.length > 0;
}

/**
 * Returns identifier name to be used in named export declarations for the
 * provided API Builder type.
 * @param type
 */
export function buildTypeIdentifier(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
) {
  return b.identifier(
    pascalCase(type.shortName),
  );
}

/**
 * Returns the TypeScript AST representation for the provided primitive type.
 * @param type
 */
export function buildApiBuilderPrimitiveTypeKind(
  type: ApiBuilderPrimitiveType,
): TSTypeKind {
  switch (type.shortName) {
    case Kind.STRING:
    case Kind.DATE_ISO8601:
    case Kind.DATE_TIME_ISO8601:
    case Kind.UUID:
      return b.tsStringKeyword();
    case Kind.BOOLEAN:
      return b.tsBooleanKeyword();
    case Kind.DECIMAL:
    case Kind.DOUBLE:
    case Kind.INTEGER:
    case Kind.LONG:
      return b.tsNumberKeyword();
    case Kind.OBJECT:
      return b.tsTypeLiteral([
        b.tsIndexSignature(
          [b.identifier.from({
            name: 'key',
            typeAnnotation: b.tsTypeAnnotation(
              b.tsStringKeyword(),
            ),
          })],
          b.tsTypeAnnotation(
            b.tsStringKeyword(),
          ),
        ),
      ]);
    default:
      return b.tsAnyKeyword();
  }
}

/**
 * Returns the TypeScript AST representation for the provided array type.
 * @param array
 */
export function buildApiBuilderArrayKind(
  array: ApiBuilderArray,
) {
  return b.tsArrayType(
    buildReferenceableApiBuilderTypeKind(array.ofType),
  );
}

/**
 * Returns the TypeScript AST representation for the provided field type.
 * @param field
 */
export function buildApiBuilderFieldPropertySignature(
  field: ApiBuilderField,
) {
  const { isRequired, name, type } = field;

  return b.tsPropertySignature.from({
    key: b.stringLiteral(name),
    optional: !isRequired,
    readonly: true,
    typeAnnotation: buildReferenceableApiBuilderTypeAnnotation(type),
  });
}

export function buildApiBuilderEnumKind(
  enumeration: ApiBuilderEnum,
) {
  if (!enumeration.values.length) {
    return b.tsUnknownKeyword();
  }

  return b.tsUnionType(
    enumeration.values.map(value => (
      b.tsLiteralType(
        b.stringLiteral(value.name),
      )
    )),
  );
}

export function buildReferenceableApiBuilderEnumKind(
  enumeration: ApiBuilderEnum,
) {
  return isInternalEnum(enumeration)
    ? b.tsTypeReference(buildTypeIdentifier(enumeration))
    : buildApiBuilderEnumKind(enumeration);
}

export function buildApiBuilderMapKind(
  type: ApiBuilderMap,
) {
  return b.tsTypeLiteral([
    b.tsIndexSignature(
      [b.identifier.from({
        name: 'key',
        typeAnnotation: b.tsTypeAnnotation(
          b.tsStringKeyword(),
        ),
      })],
      buildReferenceableApiBuilderTypeAnnotation(type.ofType),
    ),
  ]);
}

export function buildApiBuilderModelKind(
  model: ApiBuilderModel,
) {
  if (!model.fields.length) {
    return b.tsUnknownKeyword();
  }

  return b.tsTypeLiteral(
    model.fields.map(field => buildApiBuilderFieldPropertySignature(field)),
  );
}

export function buildReferenceableApiBuilderModelKind(
  model: ApiBuilderModel,
) {
  return isInternalModel(model)
    ? b.tsTypeReference(buildTypeIdentifier(model))
    : buildApiBuilderModelKind(model);
}

export function buildApiBuilderUnionKind(
  union: ApiBuilderUnion,
) {
  if (!union.types.length) {
    return b.tsUnknownKeyword();
  }

  return b.tsParenthesizedType(
    b.tsUnionType(
      union.types.map((unionType) => {
        const { discriminatorValue, type } = unionType;

        const discriminator = b.tsPropertySignature(
          b.identifier(union.discriminator),
          b.tsTypeAnnotation(
            b.tsLiteralType(
              b.stringLiteral(discriminatorValue),
            ),
          ),
        );

        if (isModelType(type)) {
          return b.tsIntersectionType([
            b.tsTypeLiteral([discriminator]),
            buildReferenceableApiBuilderModelKind(type),
          ]);
        }

        if (isEnumType(type)) {
          return b.tsTypeLiteral([
            discriminator,
            b.tsPropertySignature(
              b.identifier('value'),
              b.tsTypeAnnotation(
                buildReferenceableApiBuilderEnumKind(type),
              ),
            ),
          ]);
        }

        if (isPrimitiveType(type)) {
          return b.tsTypeLiteral([
            discriminator,
            b.tsPropertySignature(
              b.identifier('value'),
              b.tsTypeAnnotation(
                buildApiBuilderPrimitiveTypeKind(type),
              ),
            ),
          ]);
        }

        throw TypeError(
          `The provided union type (${unionType.toString()}) refers to an ` +
          'invalid type. An union type may only refer to an enum, model, or '
          + 'primitive type.',
        );
      }),
    ),
  );
}

export function buildReferenceableApiBuilderUnionKind(
  union: ApiBuilderUnion,
) {
  return isInternalUnion(union)
    ? b.tsTypeReference(buildTypeIdentifier(union))
    : buildApiBuilderUnionKind(union);
}

export function buildApiBuilderTypeKind(
  type: ApiBuilderType,
  referenceable: boolean = false,
): TSTypeKind {
  if (isArrayType(type)) {
    return buildApiBuilderArrayKind(type);
  }

  if (isMapType(type)) {
    return buildApiBuilderMapKind(type);
  }

  if (isPrimitiveType(type)) {
    return buildApiBuilderPrimitiveTypeKind(type);
  }

  if (isModelType(type)) {
    return referenceable
      ? buildReferenceableApiBuilderModelKind(type)
      : buildApiBuilderModelKind(type);
  }

  if (isEnumType(type)) {
    return referenceable
      ? buildReferenceableApiBuilderEnumKind(type)
      : buildApiBuilderEnumKind(type);
  }

  if (isUnionType(type)) {
    return referenceable
      ? buildReferenceableApiBuilderUnionKind(type)
      : buildApiBuilderUnionKind(type);
  }

  return b.tsAnyKeyword();
}

export function buildReferenceableApiBuilderTypeKind(
  type: ApiBuilderType,
) {
  return buildApiBuilderTypeKind(type, true);
}

export function buildApiBuilderTypeAnnotation(
  type: ApiBuilderType,
): TSTypeAnnotationKind {
  return b.tsTypeAnnotation(
    buildApiBuilderTypeKind(type),
  );
}

/**
 * Similar to `buildApiBuilderTypeAnnotation`, but enhanced to return a
 * type reference for internal types.
 */
export function buildReferenceableApiBuilderTypeAnnotation(
  type: ApiBuilderType,
) {
  return b.tsTypeAnnotation(
    buildApiBuilderTypeKind(type, true),
  );
}

export function buildApiBuilderEnumTypeAliasDeclaration(
  enumeration: ApiBuilderEnum,
) {
  return b.tsTypeAliasDeclaration(
    buildTypeIdentifier(enumeration),
    buildApiBuilderEnumKind(enumeration),
  );
}

export function buildApiBuilderModelInterfaceDeclaration(
  model: ApiBuilderModel,
) {
  return b.tsInterfaceDeclaration(
    buildTypeIdentifier(model),
    b.tsInterfaceBody(model.fields.map(field => buildApiBuilderFieldPropertySignature(field))),
  );
}

export function buildApiBuilderUnionTypeAliasDeclaration(
  union: ApiBuilderUnion,
) {
  return b.tsTypeAliasDeclaration(
    buildTypeIdentifier(union),
    buildApiBuilderUnionKind(union),
  );
}

export function buildApiBuilderEnumExportNamedDeclaration(
  enumeration: ApiBuilderEnum,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderEnumTypeAliasDeclaration(enumeration),
  );
}

export function buildApiBuilderModelExportNamedDeclaration(
  model: ApiBuilderModel,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderModelInterfaceDeclaration(model),
  );
}

export function buildApiBuilderUnionExportNamedDeclaration(
  union: ApiBuilderUnion,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderUnionTypeAliasDeclaration(union),
  );
}

export function buildFile(
  service: ApiBuilderService,
) {
  return b.file(
    b.program([
      ...service.enums.map(enumeration => buildApiBuilderEnumExportNamedDeclaration(enumeration)),
      ...service.models.map(model => buildApiBuilderModelExportNamedDeclaration(model)),
      ...service.unions.map(union => buildApiBuilderUnionExportNamedDeclaration(union)),
    ]),
  );
}
