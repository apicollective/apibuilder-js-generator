const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const reduce = require('lodash/reduce');
const some = require('lodash/some');

const ImportDeclaration = require('../../../../utilities/language/ImportDeclaration');
const toImportDeclaration = require('../../utilities/toImportDeclaration');
const toGraphQLScalarType = require('../../utilities/toGraphQLScalarType');
const GraphQLObjectTypeConfig = require('../../utilities/GraphQLObjectTypeConfig');

const templatePath = path.resolve(__dirname, './templates/model.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

// TODO: An API Builder model may be either a GraphQL object or a GraphQL input,
// in this iteration we will assume that they are all GraphQL objects, but we
// should think about how to generate GraphQL input types.

/**
 * Computes the name exports to import from the "graphql" package for writing
 * to generated code.
 * @param {Model} model
 * @returns {String[]}
 */
function computeGraphQLNamedExports(model) {
  const initialNamedExports = ['GraphQLObjectType'];

  if (some(model.fields, { isRequired: true })) {
    initialNamedExports.push('GraphQLNonNull');
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
    }),
  ];

  return model.fields
    .filter(field => !field.type.isPrimitiveType)
    .reduce((declarations, field) => {
      // Compute relative path to target module, which is the type we want to
      // import into the generated model.
      const declaration = toImportDeclaration(model, field.type);
      const isAlreadyImported = some(declarations, { moduleName: declaration.moduleName });
      // TODO: Check for possible default export name collision.
      return isAlreadyImported ? declarations : declarations.concat(declaration);
    }, initialImportDeclarations);
}

function generateCode(model) {
  const importDeclarations = mapToImportDeclarations(model);
  const object = GraphQLObjectTypeConfig.fromModel(model);
  const source = compiled({ importDeclarations, object });
  return prettier.format(source, {
    singleQuote: true,
    trailingComma: 'es5',
  });
}

module.exports = generateCode;
