const path = require('path');
const reduce = require('lodash/reduce');
const some = require('lodash/some');

const { renderTemplate } = require('../../../../utilities/template');
const { getBaseType, isArrayType, isPrimitiveType } = require('../../../../utilities/apibuilder');
const ImportDeclaration = require('../../../../utilities/language/ImportDeclaration');
const toImportDeclaration = require('../../utilities/toImportDeclaration');
const toGraphQLScalarType = require('../../utilities/toGraphQLScalarType');
const GraphQLObjectTypeConfig = require('../../utilities/GraphQLObjectTypeConfig');

// TODO: An API Builder model may be either a GraphQL object or a GraphQL input,
// in this iteration we will assume that they are all GraphQL objects, but we
// should think about how to generate GraphQL input types.

/**
 * Computes the name exports to import from the "graphql" package for writing
 * to generated code.
 * @param {ApiBuilderModel} model
 * @returns {String[]}
 */
function computeGraphQLNamedExports(model) {
  const initialNamedExports = ['GraphQLObjectType'];

  if (some(model.fields, { isRequired: true })) {
    initialNamedExports.push('GraphQLNonNull');
  }

  if (some(model.fields, field => isArrayType(field.type))) {
    initialNamedExports.push('GraphQLList');
  }

  return reduce(model.fields, (namedExports, field) => {
    const scalarType = toGraphQLScalarType(field.type);

    if (scalarType && !namedExports.includes(scalarType)) {
      namedExports.push(scalarType);
    }

    return namedExports;
  }, initialNamedExports).sort();
}

function mapToImportDeclarations(model) {
  // Compute named exports to import from `graphql` package.
  const initialImportDeclarations = [
    new ImportDeclaration({
      namedExports: computeGraphQLNamedExports(model),
      moduleName: 'graphql',
      defaultExport: undefined // TODO
    }),
  ];

  return model.fields
    .map(field => getBaseType(field.type))
    .filter(baseType => !isPrimitiveType(baseType))
    .reduce((declarations, baseType) => {
      // Compute relative path to target module, which is the type we want to
      // import into the generated model.
      const declaration = toImportDeclaration(model, baseType);
      const isAlreadyImported = some(declarations, { moduleName: declaration.moduleName });
      // TODO: Check for possible default export name collision.
      return isAlreadyImported ? declarations : declarations.concat(declaration);
    }, initialImportDeclarations);
}

function generateCode(model) {
  const templatePath = path.resolve(__dirname, './templates/model.ejs');
  const importDeclarations = mapToImportDeclarations(model);
  const object = GraphQLObjectTypeConfig.fromApiBuilderModel(model);
  return renderTemplate(templatePath, { importDeclarations, object });
}

module.exports = generateCode;
