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
  Kind,
} from 'apibuilder-js';
import { builders as b, namedTypes } from 'ast-types';
import { camelCase, upperFirst } from 'lodash';
import { checkIdentifier } from '../utilities/language';
import { Context } from './types';

function pascalCase(
  value: string,
): string {
  return upperFirst(camelCase(value));
}

function safeIdentifier(
  identifier: string,
): string {
  const feedback = checkIdentifier(identifier);
  return feedback.es3Warning ? `RESERVED_WORD_${identifier}` : identifier;
}

function buildQualifiedName(
  identifiers: namedTypes.Identifier[],
): namedTypes.TSQualifiedName | namedTypes.Identifier {
  function recurse(
    left: namedTypes.Identifier[],
    right: namedTypes.TSQualifiedName | namedTypes.Identifier,
  ): namedTypes.TSQualifiedName | namedTypes.Identifier {
    if (!left.length) return right;
    return recurse(left, b.tsQualifiedName(left.pop(), right));
  }

  return recurse(identifiers, identifiers.pop());
}

function buildUnknownType(type: ApiBuilderType): namedTypes.TSUnknownKeyword {
  return b.tsUnknownKeyword.from({
    comments: [
      b.commentBlock.from({
        leading: false,
        trailing: true,
        value: type.toString(),
      }),
    ],
  });
}

function buildPrimitiveType(
  type: ApiBuilderPrimitiveType,
) {
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
    case Kind.JSON:
      return b.tsAnyKeyword.from({
        comments: [b.commentBlock.from({
          leading: false,
          trailing: true,
          value: 'json',
        })],
      });
    case Kind.OBJECT:
      return b.tsAnyKeyword.from({
        comments: [b.commentBlock.from({
          leading: false,
          trailing: true,
          value: 'object',
        })],
      });
    case Kind.UNIT:
      return b.tsUndefinedKeyword();
    default:
      return buildUnknownType(type);
  }
}

function buildArrayType(
  array: ApiBuilderArray,
  context: Context,
): namedTypes.TSArrayType {
  return b.tsArrayType(buildType(array.ofType, context));
}

function buildMapType(
  map: ApiBuilderMap,
  context: Context,
): namedTypes.TSTypeReference {
  return b.tsTypeReference.from({
    typeName: b.identifier('Record'),
    typeParameters: b.tsTypeParameterInstantiation.from({
      params: [
        b.tsStringKeyword(),
        buildType(map.ofType, context),
      ],
    }),
  });
}

function buildEnumType(
  enumeration: ApiBuilderEnum,
): namedTypes.TSUnionType {
  return b.tsUnionType(
    enumeration.values.map(value => b.tsLiteralType(
      b.stringLiteral(value.value),
    )),
  );
}

function buildModelType(
  model: ApiBuilderModel,
  context: Context,
): namedTypes.TSTypeLiteral {
  return b.tsTypeLiteral(
    model.fields.map(field => buildFieldPropertySignature(field, context)),
  );
}

function buildUnionType(
  union: ApiBuilderUnion,
  context: Context,
): namedTypes.TSParenthesizedType {
  return b.tsParenthesizedType(
    b.tsUnionType(
      union.types.map((unionType) => {
        const discriminator = b.tsPropertySignature(
          b.identifier(union.discriminator),
          b.tsTypeAnnotation(
            b.tsLiteralType(
              b.stringLiteral(unionType.discriminatorValue),
            ),
          ),
        );

        if (isModelType(unionType.type)) {
          return buildType(unionType.type, context);
        }

        if (isEnumType(unionType.type)) {
          return b.tsTypeLiteral([
            discriminator,
            b.tsPropertySignature(
              b.identifier('value'),
              buildTypeAnnotation(unionType.type, context),
            ),
          ]);
        }

        if (isPrimitiveType(unionType.type)) {
          return b.tsTypeLiteral([
            discriminator,
            b.tsPropertySignature(
              b.identifier('value'),
              buildTypeAnnotation(unionType.type, context),
            ),
          ]);
        }

        // The provided union type refers to an invalid type.
        // An union type may only refer to an enum, model, or primitive type.
        return buildUnknownType(unionType.type);
      }),
    ),
  );
}

/**
 * Returns `Identifier` for the specified type. The identifier is formatted
 * in pascal case and illegal identifiers will be prefixed with `RESERVED_WORD`
 * to avoid runtime errors in a JavaScript environment.
 */
export function buildTypeIdentifier(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): namedTypes.Identifier {
  return b.identifier(
    safeIdentifier(pascalCase(type.shortName)),
  );
}

/**
 * Returns `TSQualifiedName` for the specified type. Illegal identifiers will be
 * prefixed with `RESERVED_WORD` to avoid runtime errors in a JavaScript
 * environment.
 */
export function buildTypeQualifiedName(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): namedTypes.Identifier | namedTypes.TSQualifiedName {
  const identifiers = type.packageName
    .split('.')
    .concat(pascalCase(type.shortName))
    .map(safeIdentifier)
    .map(b.identifier);
  return buildQualifiedName(identifiers);
}

/**
 * Returns `TSTypeReference` for the specified type.
 */
export function buildTypeReference(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): namedTypes.TSTypeReference {
  return b.tsTypeReference(buildTypeQualifiedName(type));
}

export function buildType(
  type: ApiBuilderType,
  context: Context,
) {
  if (isArrayType(type)) {
    return buildArrayType(type, context);
  }

  if (isMapType(type)) {
    return buildMapType(type, context);
  }

  if (isPrimitiveType(type)) {
    return buildPrimitiveType(type);
  }

  if (context.unresolvedTypes.includes(type.fullName)) {
    return buildUnknownType(type);
  }

  return buildTypeReference(type);
}

export function buildTypeAnnotation(
  type: ApiBuilderType,
  context: Context,
): namedTypes.TSTypeAnnotation {
  return b.tsTypeAnnotation(
    buildType(type, context),
  );
}

function buildFieldPropertySignature(
  field: ApiBuilderField,
  context: Context,
) {
  return b.tsPropertySignature.from({
    key: b.stringLiteral(field.name),
    optional: !field.isRequired,
    readonly: true,
    typeAnnotation: buildTypeAnnotation(field.type, context),
  });
}

function buildEnumTypeAliasDeclaration(
  enumeration: ApiBuilderEnum,
): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: buildTypeIdentifier(enumeration),
    typeAnnotation: buildEnumType(enumeration),
  });
}

function buildModelInterfaceDeclaration(
  model: ApiBuilderModel,
  context: Context,
): namedTypes.TSInterfaceDeclaration {
  const { discriminator, discriminatorValue } = model;
  const properties: namedTypes.TSPropertySignature[] = [];

  if (discriminator != null && discriminatorValue != null) {
    properties.push(b.tsPropertySignature.from({
      key: b.stringLiteral(discriminator),
      optional: false,
      readonly: true,
      typeAnnotation: b.tsTypeAnnotation.from({
        typeAnnotation: b.tsLiteralType.from({
          literal: b.stringLiteral(discriminatorValue),
        }),
      }),
    }));
  }

  model.fields.forEach((field) => {
    properties.push(buildFieldPropertySignature(field, context));
  });

  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: properties,
    }),
    id: buildTypeIdentifier(model),
  });
}

function buildUnionTypeAliasDeclaration(
  union: ApiBuilderUnion,
  context: Context,
): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: buildTypeIdentifier(union),
    typeAnnotation: buildUnionType(union, context),
  });
}

function buildModuleIdentifiers(
  service: ApiBuilderService,
  type: 'enums' | 'models' | 'unions',
): namedTypes.Identifier[] {
  return service.namespace.split('.').map(safeIdentifier).concat([type]).map(b.identifier);
}

function buildModuleDeclaration(
  identifiers: namedTypes.Identifier[],
  declarations: (namedTypes.TSInterfaceDeclaration | namedTypes.TSTypeAliasDeclaration)[],
): namedTypes.TSModuleDeclaration {
  function recurse(
    left: namedTypes.Identifier[],
    right: namedTypes.TSModuleDeclaration,
  ): namedTypes.TSModuleDeclaration {
    if (!identifiers.length) return right;
    return recurse(left, b.tsModuleDeclaration.from({
      body: right,
      declare: true,
      id: left.pop(),
    }));
  }

  return recurse(
    identifiers,
    b.tsModuleDeclaration.from({
      body: b.tsModuleBlock(declarations),
      declare: true,
      id: identifiers.pop(),
    }),
  );
}

function buildEnumModuleDeclaration(
  service: ApiBuilderService,
): namedTypes.TSModuleDeclaration {
  const identifiers = buildModuleIdentifiers(service, 'enums');
  const declarations = service.enums
    .map(enumeration => buildEnumTypeAliasDeclaration(enumeration));
  return buildModuleDeclaration(identifiers, declarations);
}

function buildModelModuleDeclaration(
  service: ApiBuilderService,
  context: Context,
) {
  const identifiers = buildModuleIdentifiers(service, 'models');
  const declarations = service.models
    .map(model => buildModelInterfaceDeclaration(model, context));
  return buildModuleDeclaration(identifiers, declarations);
}

function buildUnionModuleDeclaration(
  service: ApiBuilderService,
  context: Context,
) {
  const identifiers = buildModuleIdentifiers(service, 'unions');
  const declarations = service.unions
    .map(union => buildUnionTypeAliasDeclaration(union, context));
  return buildModuleDeclaration(identifiers, declarations);
}

export function buildModuleDeclarationsFromService(
  service: ApiBuilderService,
  context: Context,
): namedTypes.TSModuleDeclaration[] {
  const modules: namedTypes.TSModuleDeclaration[] = [];

  if (service.enums.length) {
    modules.push(buildEnumModuleDeclaration(service));
  }

  if (service.models.length) {
    modules.push(buildModelModuleDeclaration(service, context));
  }

  if (service.unions.length) {
    modules.push(buildUnionModuleDeclaration(service, context));
  }

  return modules;
}

export function buildModuleDeclarations(
  context: Context,
): namedTypes.TSModuleDeclaration[] {
  const services = context.importedServices.concat(context.rootService);
  return services.reduce<namedTypes.TSModuleDeclaration[]>(
    (modules, service) => modules.concat(buildModuleDeclarationsFromService(service, context)),
    [],
  );
}
