const path = require('path');
const reduce = require('lodash/reduce');
const some = require('lodash/some');

const { renderTemplate } = require('../../../../utilities/template');

const {
  ApiBuilderFile,
  getBaseType,
  isMapType,
  isPrimitiveType,
  isEnclosingType,
} = require('../../../../utilities/apibuilder');

const ImportDeclaration = require('../../../../utilities/language/ImportDeclaration');
const { destinationPathFromType } = require('../../utilities/destinationPath');
const toImportDeclaration = require('../../utilities/toImportDeclaration');
const toGraphQLScalarType = require('../../utilities/toGraphQLScalarType');
const toCustomScalarType = require('../../utilities/toCustomScalarType');
const GraphQLObjectType = require('../../utilities/GraphQLObjectType');

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

  return Array.from(reduce(model.fields, (namedExports, field) => {
    const type = isEnclosingType(field.type) ? field.type.ofType : field.type;
    const scalarType = toGraphQLScalarType(type);

    if (scalarType) {
      namedExports.add(scalarType);
    }

    return namedExports;
  }, initialNamedExports)).sort();
}

function computeScalarExports(model) {
  const initialNamedExports = [];

  if (some(model.fields, field => isMapType(field.type))) {
    initialNamedExports.push('makeMapEntry');
  }

  return reduce(model.fields, (namedExports, field) => {
    const type = isEnclosingType(field.type) ? field.type.ofType : field.type;
    const scalarType = toCustomScalarType(type);

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
    new ImportDeclaration({
      namedExports: computeScalarExports(model),
      moduleName: '../scalars',
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
  const templatePath = path.resolve(__dirname, './templates/GraphQLObjectType.ejs');
  return renderTemplate(templatePath, {
    importDeclarations: mapToImportDeclarations(model),
    object: GraphQLObjectType.fromApiBuilderModel(model),
  });
}

exports.generateCode = generateCode;

/**
 * Create API Builder file containing generated GraphQL object type schema from
 * provided API Builder model.
 * @param {ApiBuilderModel} model
 * @returns {ApiBuilderFile}
 */
function generateFile(model) {
  const destinationPath = destinationPathFromType(model);
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const contents = generateCode(model);
  return new ApiBuilderFile(basename, dirname, contents);
}

exports.generateFile = generateFile;
