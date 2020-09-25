import { reduce, some } from 'lodash';
import path = require('path');
import {
  ApiBuilderFile,
  ApiBuilderModel,
  ApiBuilderType,
  getBaseType,
  isEnclosingType,
  isMapType,
  isPrimitiveType,
} from '../../../../utilities/apibuilder';
import { renderTemplate } from '../../../../utilities/template';
import { destinationPathFromType } from '../../utilities/destinationPath';
import { getFullType, isReference } from '../../utilities/reference';

import ImportDeclaration from '../../../../utilities/language/ImportDeclaration';
import GraphQLObjectType = require('../../utilities/GraphQLObjectType');
import toCustomScalarType = require('../../utilities/toCustomScalarType');
import toGraphQLScalarType = require('../../utilities/toGraphQLScalarType');
import toImportDeclaration = require('../../utilities/toImportDeclaration');

// TODO: An API Builder model may be either a GraphQL object or a GraphQL input,
// in this iteration we will assume that they are all GraphQL objects, but we
// should think about how to generate GraphQL input types.

/**
 * Computes the name exports to import from the "graphql" package for writing
 * to generated code.
 */
function computeGraphQLNamedExports(model: ApiBuilderModel): string[] {
  const initialNamedExports = new Set(['GraphQLObjectType']);

  // required fields -> NonNull
  if (some(model.fields, { isRequired: true })) {
    initialNamedExports.add('GraphQLNonNull');
  }

  // maps and arrays become NonNull Lists
  if (some(model.fields, field => isEnclosingType(field.type))) {
    initialNamedExports.add('GraphQLList');
    initialNamedExports.add('GraphQLNonNull');
  }

  return Array.from(reduce(
    model.fields,
    (namedExports, field) => {
      const type = isEnclosingType(field.type) ? field.type.ofType : field.type;
      const scalarType = toGraphQLScalarType(type);

      if (scalarType) {
        namedExports.add(scalarType);
      }

      return namedExports;
    },
    initialNamedExports,
  )).sort() as string[];
}

function computeScalarExports(model: ApiBuilderModel) {
  const initialNamedExports = [];

  if (some(model.fields, field => isMapType(field.type))) {
    initialNamedExports.push('makeMapEntry');
  }

  return reduce(
    model.fields,
    (namedExports, field) => {
      const type = isEnclosingType(field.type) ? field.type.ofType : field.type;
      const scalarType = toCustomScalarType(type);

      if (scalarType && !namedExports.includes(scalarType)) {
        namedExports.push(scalarType);
      }

      return namedExports;
    },
    initialNamedExports,
  ).sort();
}

function mapToImportDeclarations(model: ApiBuilderModel) {
  // Compute named exports to import from `graphql` package.
  const initialImportDeclarations = [
    new ImportDeclaration({
      moduleName: 'graphql',
      namedExports: computeGraphQLNamedExports(model),
    }),
  ];

  const scalarExports = computeScalarExports(model);
  if (scalarExports.length > 0) {
    initialImportDeclarations.push(new ImportDeclaration({
      moduleName: '../scalars',
      namedExports: computeScalarExports(model),
    }));
  }

  return model.fields
    .map(field => getBaseType(field.type))
    .filter(baseType => !isPrimitiveType(baseType))
    .reduce(
      (declarations, baseType) => {
        let type: ApiBuilderType = baseType;
        if (isReference(baseType)) {
          const fullType = getFullType(baseType, model.service);
          // ReservationItem has a field of type ReservationItemReference
          // Don't let the file import itself
          if (fullType && fullType !== model) {
            type = fullType;
          }
        }

        // Compute relative path to target module, which is the type we want to
        // import into the generated model.
        const declaration = toImportDeclaration(model, type);
        const isAlreadyImported = some(declarations, { moduleName: declaration.moduleName });
        // TODO: Check for possible default export name collision.
        return isAlreadyImported ? declarations : declarations.concat(declaration);
      },
      initialImportDeclarations,
    );
}

export function generateCode(model: ApiBuilderModel) {
  const templatePath = path.resolve(__dirname, './templates/GraphQLObjectType.ejs');
  return renderTemplate(templatePath, {
    importDeclarations: mapToImportDeclarations(model),
    object: GraphQLObjectType.fromApiBuilderModel(model),
  });
}

/**
 * Create API Builder file containing generated GraphQL object type schema from
 * provided API Builder model.
 */
export function generateFile(model: ApiBuilderModel) {
  const destinationPath = destinationPathFromType(model);
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const contents = generateCode(model);
  return new ApiBuilderFile(basename, dirname, contents);
}
