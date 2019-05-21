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
  IdentifierKind,
  StatementKind,
  TSQualifiedNameKind,
  TSTypeAnnotationKind,
  TSTypeKind,
} from 'ast-types/gen/kinds';

import {
  camelCase,
  flatMap,
  property,
  upperFirst,
} from 'lodash';

import {
  isReservedWord,
} from './reserved-words';

// tslint:disable-next-line:interface-name
interface GeneratorMetadata {
  indexedTypes: { [key: string]: true };
  isReferenceable: (type: ApiBuilderEnum | ApiBuilderUnion | ApiBuilderModel) => boolean;
}

function safeIdentifier(identifier: string) {
  return isReservedWord(identifier)
    ? `RESERVED_WORD_${identifier}`
    : identifier;
}

/**
 * Converts `value` to pascal case.
 * @param value
 */
function pascalCase(value: string) {
  return upperFirst(camelCase(value));
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
    safeIdentifier(pascalCase(type.shortName)),
  );
}

function buildRecursiveQualifiedName(
  identifiers: IdentifierKind[] = [],
  left: IdentifierKind | TSQualifiedNameKind,
): IdentifierKind | TSQualifiedNameKind {
  if (!identifiers.length) {
    return left;
  }

  const [right, ...remaining] = identifiers;

  const ast = right != null
    ? b.tsQualifiedName(left, right)
    : left;

  if (!remaining.length) {
    return ast;
  }

  return buildRecursiveQualifiedName(remaining, ast);
}

export function buildTypeQualifiedName(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
) {
  const identifiers = type.packageName.split('.').map(safeIdentifier).concat([
    safeIdentifier(pascalCase(type.shortName)),
  ]);
  const [left, ...remaining] = identifiers.map(identifier => b.identifier(identifier));
  return buildRecursiveQualifiedName(remaining, left);
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
      return b.tsUnknownKeyword();
  }
}

/**
 * Returns the TypeScript AST representation for the provided array type.
 * @param array
 */
export function buildApiBuilderArrayKind(
  array: ApiBuilderArray,
  metadata: GeneratorMetadata,
) {
  return b.tsArrayType(
    buildApiBuilderType(array.ofType, metadata, true),
  );
}

/**
 * Returns the TypeScript AST representation for the provided field type.
 * @param field
 */
export function buildApiBuilderFieldPropertySignature(
  field: ApiBuilderField,
  metadata: GeneratorMetadata,
) {
  const { isRequired, name, type } = field;

  return b.tsPropertySignature.from({
    key: b.stringLiteral(name),
    optional: !isRequired,
    readonly: true,
    typeAnnotation: buildApiBuilderTypeAnnotation(type, metadata, true),
  });
}

export function buildApiBuilderEnum(
  enumeration: ApiBuilderEnum,
) {
  return b.tsUnionType(
    enumeration.values.map(value => (
      b.tsLiteralType(
        b.stringLiteral(value.name),
      )
    )),
  );
}

/**
 * Similar to `buildApiBuilderEnum`, but enhanced to return a reference type
 * when `enumeration` is known to be generated or unknown keyword when it
 * cannot be generated due to lack of information.
 * @param enumeration
 * @param metadata
 */
export function buildApiBuilderEnumReference(
  enumeration: ApiBuilderEnum,
  metadata: GeneratorMetadata,
) {
  if (metadata.isReferenceable(enumeration)) {
    return b.tsTypeReference(buildTypeQualifiedName(enumeration));
  }

  if (enumeration.values.length > 0) {
    return buildApiBuilderEnum(enumeration);
  }

  return b.tsUnknownKeyword();
}

export function buildApiBuilderMap(
  type: ApiBuilderMap,
  metadata: GeneratorMetadata,
) {
  return b.tsTypeLiteral([
    b.tsIndexSignature(
      [b.identifier.from({
        name: 'key',
        typeAnnotation: b.tsTypeAnnotation(
          b.tsStringKeyword(),
        ),
      })],
      buildApiBuilderTypeAnnotation(type.ofType, metadata, true),
    ),
  ]);
}

export function buildApiBuilderModel(
  model: ApiBuilderModel,
  metadata: GeneratorMetadata,
) {
  return b.tsTypeLiteral(
    model.fields.map(field => (
      buildApiBuilderFieldPropertySignature(field, metadata)
    )),
  );
}

/**
 * Similar to `buildApiBuilderModel`, but enhanced to return a reference type
 * when the provided `model` is known to be generated or an unknown keyword
 * when it cannot be generated due to lack of information.
 * @param model
 * @param metadata
 */
export function buildApiBuilderModelReference(
  model: ApiBuilderModel,
  metadata: GeneratorMetadata,
) {
  if (metadata.isReferenceable(model)) {
    return b.tsTypeReference(buildTypeQualifiedName(model));
  }

  if (model.fields.length > 0) {
    return buildApiBuilderModel(model, metadata);
  }

  return b.tsUnknownKeyword();
}

export function buildApiBuilderUnion(
  union: ApiBuilderUnion,
  metadata: GeneratorMetadata,
) {
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
            buildApiBuilderModelReference(type, metadata),
          ]);
        }

        if (isEnumType(type)) {
          return b.tsTypeLiteral([
            discriminator,
            b.tsPropertySignature(
              b.identifier('value'),
              b.tsTypeAnnotation(
                buildApiBuilderEnumReference(type, metadata),
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

/**
 * Similar to `buildApiBuilderUnion`, but enhanced to return a reference type
 * when the provided `union` is known to be generated or unknown keyword
 * when it cannot be generated due to lack of information.
 * @param union
 * @param metadata
 */
export function buildApiBuilderUnionReference(
  union: ApiBuilderUnion,
  metadata: GeneratorMetadata,
) {
  if (metadata.isReferenceable(union)) {
    b.tsTypeReference(buildTypeQualifiedName(union));
  }

  if (union.types.length > 0) {
    return buildApiBuilderUnion(union, metadata);
  }

  return b.tsUnknownKeyword();
}

export function buildApiBuilderType(
  type: ApiBuilderType,
  metadata: GeneratorMetadata,
  referenceable: boolean = false,
): TSTypeKind {
  if (isArrayType(type)) {
    return buildApiBuilderArrayKind(type, metadata);
  }

  if (isMapType(type)) {
    return buildApiBuilderMap(type, metadata);
  }

  if (isPrimitiveType(type)) {
    return buildApiBuilderPrimitiveTypeKind(type);
  }

  if (isModelType(type)) {
    return referenceable
      ? buildApiBuilderModelReference(type, metadata)
      : buildApiBuilderModel(type, metadata);
  }

  if (isEnumType(type)) {
    return referenceable
      ? buildApiBuilderEnumReference(type, metadata)
      : buildApiBuilderEnum(type);
  }

  if (isUnionType(type)) {
    return referenceable
      ? buildApiBuilderUnionReference(type, metadata)
      : buildApiBuilderUnion(type, metadata);
  }

  return b.tsAnyKeyword();
}

export function buildApiBuilderTypeAnnotation(
  type: ApiBuilderType,
  metadata: GeneratorMetadata,
  referenceable: boolean = false,
): TSTypeAnnotationKind {
  return b.tsTypeAnnotation(
    buildApiBuilderType(type, metadata, referenceable),
  );
}

export function buildApiBuilderEnumTypeAliasDeclaration(
  enumeration: ApiBuilderEnum,
) {
  return b.tsTypeAliasDeclaration(
    buildTypeIdentifier(enumeration),
    buildApiBuilderEnum(enumeration),
  );
}

export function buildApiBuilderModelInterfaceDeclaration(
  model: ApiBuilderModel,
  metadata: GeneratorMetadata,
) {
  return b.tsInterfaceDeclaration(
    buildTypeIdentifier(model),
    b.tsInterfaceBody(model.fields.map(field => (
      buildApiBuilderFieldPropertySignature(field, metadata)
    ))),
  );
}

export function buildApiBuilderUnionTypeAliasDeclaration(
  union: ApiBuilderUnion,
  metadata: GeneratorMetadata,
) {
  return b.tsTypeAliasDeclaration(
    buildTypeIdentifier(union),
    buildApiBuilderUnion(union, metadata),
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
  metadata: GeneratorMetadata,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderModelInterfaceDeclaration(model, metadata),
  );
}

export function buildApiBuilderUnionExportNamedDeclaration(
  union: ApiBuilderUnion,
  metadata: GeneratorMetadata,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderUnionTypeAliasDeclaration(union, metadata),
  );
}

export function buildApiBuilderNamespace(
  service: ApiBuilderService,
  type: 'models' | 'enums' | 'unions',
  metadata: GeneratorMetadata,
) {
  let statements: StatementKind[] = [];

  if (type === 'models') {
    statements = service.models.map(model => (
      buildApiBuilderModelExportNamedDeclaration(model, metadata)
    ));
  } else if (type === 'enums') {
    statements = service.enums.map(enumeration => (
      buildApiBuilderEnumExportNamedDeclaration(enumeration)
    ));
  } else {
    statements = service.unions.map(union => (
      buildApiBuilderUnionExportNamedDeclaration(union, metadata)
    ));
  }

  const identifiers = service.namespace.split('.').map(safeIdentifier).concat([type]);

  const initialIdentifier = identifiers[identifiers.length - 1];

  const initialValue = b.tsModuleDeclaration(
    b.identifier(initialIdentifier),
    b.tsModuleBlock(statements),
  );

  return identifiers.slice(0, identifiers.length - 1).reverse().reduce(
    (previousValue, namespace) => b.tsModuleDeclaration(
      b.identifier(namespace),
      previousValue,
    ),
    initialValue,
  );
}

export function buildApiBuilderQualifiedTypeAliasDeclaration(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
) {
  return b.exportNamedDeclaration(
    b.tsTypeAliasDeclaration(
      buildTypeIdentifier(type),
      b.tsTypeReference(
        buildTypeQualifiedName(type),
      ),
    ),
  );
}

function shortNameCompare(a1, a2) {
  if (a1.shortName > a2.shortName) {
    return 1;
  }
  if (a1.shortName < a2.shortName) {
    return -1;
  }
  return 0;
}

export function buildFile(
  service: ApiBuilderService,
  importedServices: ApiBuilderService[] = [],
) {
  const indexed = (
    // tslint:disable-next-line:array-type
    types: (ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion)[],
    initialValue = {},
  ): { [key: string]: true } => types.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.fullName]: true,
    }),
    initialValue,
  );

  const metadata: GeneratorMetadata = {
    indexedTypes: importedServices.reduce(
      (previousValue, importedService) => ({
        ...previousValue,
        ...indexed(importedService.enums),
        ...indexed(importedService.models),
        ...indexed(importedService.unions),
      }),
      {
        ...indexed(service.enums),
        ...indexed(service.models),
        ...indexed(service.unions),
      },
    ),
    isReferenceable(type) {
      return this.indexedTypes[type.fullName] === true;
    },
  };

  return b.file(
    b.program([
      ...flatMap(importedServices, (importedService) => {
        return [
          buildApiBuilderNamespace(importedService, 'enums', metadata),
          buildApiBuilderNamespace(importedService, 'models', metadata),
          buildApiBuilderNamespace(importedService, 'unions', metadata),
        ];
      }),
      buildApiBuilderNamespace(service, 'enums', metadata),
      buildApiBuilderNamespace(service, 'models', metadata),
      buildApiBuilderNamespace(service, 'unions', metadata),
      ...[
        ...service.enums,
        ...service.models,
        ...service.unions,
      ].sort(shortNameCompare).map(buildApiBuilderQualifiedTypeAliasDeclaration),
    ]),
  );
}
