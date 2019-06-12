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
  upperFirst,
} from 'lodash';

import debug from 'debug';

import {
  isReservedWord,
} from './reserved-words';

const log = debug('apibuilder:ts_declaration:builders');

type ReferenceableType = ApiBuilderEnum | ApiBuilderUnion | ApiBuilderModel;

// tslint:disable-next-line:interface-name
interface Context {
  knownTypes: { [key: string]: true };
  unknownTypes: { [key: string]: true };
  isReferenceable: (type: ReferenceableType) => boolean;
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

function buildUnknownType(missingType: ApiBuilderType, context: Context) {
  if (!context.unknownTypes.hasOwnProperty(missingType.toString())) {
    context.unknownTypes[missingType.toString()] = true;
  }

  return b.tsUnknownKeyword();
}

/**
 * Returns identifier name to be used in named export declarations for the
 * provided API Builder type.
 * @param type
 */
export function buildTypeIdentifier(
  type: ReferenceableType,
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
  type: ReferenceableType,
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
  context: Context,
): TSTypeKind {
  switch (type.shortName) {
    case Kind.STRING:
    case Kind.DATE_ISO8601:
    case Kind.DATE_TIME_ISO8601:
    case Kind.UUID:
    case Kind.JSON:
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
      return buildUnknownType(type, context);
  }
}

/**
 * Returns the TypeScript AST representation for the provided array type.
 * @param array
 */
export function buildApiBuilderArrayKind(
  array: ApiBuilderArray,
  context: Context,
) {
  return b.tsArrayType(
    buildApiBuilderType(array.ofType, context, true),
  );
}

/**
 * Returns the TypeScript AST representation for the provided field type.
 * @param field
 */
export function buildApiBuilderFieldPropertySignature(
  field: ApiBuilderField,
  context: Context,
) {
  const { isRequired, name, type } = field;

  return b.tsPropertySignature.from({
    key: b.stringLiteral(name),
    optional: !isRequired,
    readonly: true,
    typeAnnotation: buildApiBuilderTypeAnnotation(type, context, true),
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
 * @param context
 */
export function buildApiBuilderEnumReference(
  enumeration: ApiBuilderEnum,
  context: Context,
) {
  if (context.isReferenceable(enumeration)) {
    return b.tsTypeReference(buildTypeQualifiedName(enumeration));
  }

  if (enumeration.values.length > 0) {
    return buildApiBuilderEnum(enumeration);
  }

  return buildUnknownType(enumeration, context);
}

export function buildApiBuilderMap(
  type: ApiBuilderMap,
  context: Context,
) {
  return b.tsTypeLiteral([
    b.tsIndexSignature(
      [b.identifier.from({
        name: 'key',
        typeAnnotation: b.tsTypeAnnotation(
          b.tsStringKeyword(),
        ),
      })],
      buildApiBuilderTypeAnnotation(type.ofType, context, true),
    ),
  ]);
}

export function buildApiBuilderModel(
  model: ApiBuilderModel,
  context: Context,
) {
  return b.tsTypeLiteral(
    model.fields.map(field => (
      buildApiBuilderFieldPropertySignature(field, context)
    )),
  );
}

/**
 * Similar to `buildApiBuilderModel`, but enhanced to return a reference type
 * when the provided `model` is known to be generated or an unknown keyword
 * when it cannot be generated due to lack of information.
 * @param model
 * @param context
 */
export function buildApiBuilderModelReference(
  model: ApiBuilderModel,
  context: Context,
) {
  if (context.isReferenceable(model)) {
    return b.tsTypeReference(buildTypeQualifiedName(model));
  }

  if (model.fields.length > 0) {
    return buildApiBuilderModel(model, context);
  }

  return buildUnknownType(model, context);
}

export function buildApiBuilderUnion(
  union: ApiBuilderUnion,
  context: Context,
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
            buildApiBuilderModelReference(type, context),
          ]);
        }

        if (isEnumType(type)) {
          return b.tsTypeLiteral([
            discriminator,
            b.tsPropertySignature(
              b.identifier('value'),
              b.tsTypeAnnotation(
                buildApiBuilderEnumReference(type, context),
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
                buildApiBuilderPrimitiveTypeKind(type, context),
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
 * @param context
 */
export function buildApiBuilderUnionReference(
  union: ApiBuilderUnion,
  context: Context,
) {
  if (context.isReferenceable(union)) {
    return b.tsTypeReference(buildTypeQualifiedName(union));
  }

  if (union.types.length > 0) {
    return buildApiBuilderUnion(union, context);
  }

  return buildUnknownType(union, context);
}

export function buildApiBuilderType(
  type: ApiBuilderType,
  context: Context,
  referenceable: boolean = false,
): TSTypeKind {
  if (isArrayType(type)) {
    return buildApiBuilderArrayKind(type, context);
  }

  if (isMapType(type)) {
    return buildApiBuilderMap(type, context);
  }

  if (isPrimitiveType(type)) {
    return buildApiBuilderPrimitiveTypeKind(type, context);
  }

  if (isModelType(type)) {
    return referenceable
      ? buildApiBuilderModelReference(type, context)
      : buildApiBuilderModel(type, context);
  }

  if (isEnumType(type)) {
    return referenceable
      ? buildApiBuilderEnumReference(type, context)
      : buildApiBuilderEnum(type);
  }

  if (isUnionType(type)) {
    return referenceable
      ? buildApiBuilderUnionReference(type, context)
      : buildApiBuilderUnion(type, context);
  }

  return b.tsAnyKeyword();
}

export function buildApiBuilderTypeAnnotation(
  type: ApiBuilderType,
  context: Context,
  referenceable: boolean = false,
): TSTypeAnnotationKind {
  return b.tsTypeAnnotation(
    buildApiBuilderType(type, context, referenceable),
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
  context: Context,
) {
  return b.tsInterfaceDeclaration(
    buildTypeIdentifier(model),
    b.tsInterfaceBody(model.fields.map(field => (
      buildApiBuilderFieldPropertySignature(field, context)
    ))),
  );
}

export function buildApiBuilderUnionTypeAliasDeclaration(
  union: ApiBuilderUnion,
  context: Context,
) {
  return b.tsTypeAliasDeclaration(
    buildTypeIdentifier(union),
    buildApiBuilderUnion(union, context),
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
  context: Context,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderModelInterfaceDeclaration(model, context),
  );
}

export function buildApiBuilderUnionExportNamedDeclaration(
  union: ApiBuilderUnion,
  context: Context,
) {
  return b.exportNamedDeclaration(
    buildApiBuilderUnionTypeAliasDeclaration(union, context),
  );
}

export function buildApiBuilderNamespace(
  service: ApiBuilderService,
  type: 'models' | 'enums' | 'unions',
  context: Context,
) {
  let statements: StatementKind[] = [];

  if (type === 'models') {
    statements = service.models.map(model => (
      buildApiBuilderModelExportNamedDeclaration(model, context)
    ));
  } else if (type === 'enums') {
    statements = service.enums.map(enumeration => (
      buildApiBuilderEnumExportNamedDeclaration(enumeration)
    ));
  } else {
    statements = service.unions.map(union => (
      buildApiBuilderUnionExportNamedDeclaration(union, context)
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
  type: ReferenceableType,
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

function stringCompare(s1: string, s2: string) {
  if (s1 > s2) return 1;
  if (s1 < s2) return -1;
  return 0;
}

function shortNameCompare(t1: ReferenceableType, t2: ReferenceableType) {
  return stringCompare(t1.shortName, t2.shortName);
}

export function buildFile(
  service: ApiBuilderService,
  importedServices: ApiBuilderService[] = [],
) {
  const indexed = (
    // tslint:disable-next-line:array-type
    types: ReferenceableType[],
    initialValue = {},
  ): { [key: string]: true } => types.reduce(
    (previousValue, currentValue) => ({
      ...previousValue,
      [currentValue.fullName]: true,
    }),
    initialValue,
  );

  const context: Context = {
    knownTypes: importedServices.reduce(
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
      return this.knownTypes[type.fullName] === true;
    },
    unknownTypes: {},
  };

  const knownTypes = Object.keys(context.knownTypes).sort(stringCompare);
  log(`INFO: building the following types: ${JSON.stringify(knownTypes)}`);

  const ast = b.file(
    b.program([
      ...flatMap(importedServices, (importedService) => {
        return [
          buildApiBuilderNamespace(importedService, 'enums', context),
          buildApiBuilderNamespace(importedService, 'models', context),
          buildApiBuilderNamespace(importedService, 'unions', context),
        ];
      }),
      buildApiBuilderNamespace(service, 'enums', context),
      buildApiBuilderNamespace(service, 'models', context),
      buildApiBuilderNamespace(service, 'unions', context),
      ...[
        ...service.enums,
        ...service.models,
        ...service.unions,
      ].sort(shortNameCompare).map(buildApiBuilderQualifiedTypeAliasDeclaration),
    ]),
  );

  const unknownTypes = Object.keys(context.unknownTypes).sort(stringCompare);
  if (unknownTypes.length) {
    log(`WARN: the following types were unknown: ${JSON.stringify(unknownTypes)}.`);
  }

  return ast;
}
