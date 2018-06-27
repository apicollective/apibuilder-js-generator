const path = require('path');
const toImportDeclaration = require('../../utilities/toImportDeclaration');
const GraphQLSchemaConfig = require('../../utilities/GraphQLSchemaConfig');
const { destinationPathFromService } = require('../../utilities/destinationPath');
const ImportDeclaration = require('../../../../utilities/language/ImportDeclaration');
const { renderTemplate } = require('../../../../utilities/template');
const { ApiBuilderFile } = require('../../../../utilities/apibuilder');

const toGraphQLScalarType = require('../../utilities/toGraphQLScalarType');
const toCustomScalarType = require('../../utilities/toCustomScalarType');
const {
  getBaseType,
  isEnclosingType,
  isPrimitiveType,
  isMapType,
} = require('../../../../utilities/apibuilder');
const {
  flatMap,
  some,
  reduce,
  uniq,
} = require('lodash');

/**
 * Computes the name exports to import from the "graphql" package for writing
 * to generated code.
 * @param {ApiBuilderOperation} operation
 * @returns {String[]}
 */
function computeGraphQLNamedExports(operation) {
  const initialNamedExports = new Set(['GraphQLSchema', 'GraphQLObjectType']);

  if (some(operation.arguments, { required: true })) {
    initialNamedExports.add('GraphQLNonNull');
  }

  if (isEnclosingType(operation.resultType) || some(operation.args, arg => isEnclosingType(arg.type))) {
    initialNamedExports.add('GraphQLList');
    initialNamedExports.add('GraphQLNonNull');
  }

  const exports = operation.arguments
    .map(arg => arg.type)
    .concat(operation.resultType)
    .reduce((namedExports, type) => {
      const scalarType = toGraphQLScalarType(type);

      if (scalarType) {
        namedExports.add(scalarType);
      }

      return namedExports;
    }, initialNamedExports);

  return Array.from(exports);
}

function computeScalarExports(operation) {
  const initialNamedExports = [];

  const types = operation.arguments.map(arg => arg.type).concat(operation.resultType);

  if (some(types, isMapType)) {
    initialNamedExports.push('makeMapEntry');
  }

  return reduce(types, (namedExports, type) => {
    const scalarType = toCustomScalarType(isEnclosingType(type) ? type.ofType : type);

    if (scalarType && !namedExports.includes(scalarType)) {
      namedExports.push(scalarType);
    }

    return namedExports;
  }, initialNamedExports);
}


function mapToImportDeclarations(service) {
  // Compute named exports to import from `graphql` package.
  const initialImportDeclarations = [
    new ImportDeclaration({
      namedExports: uniq(flatMap(flatMap(service.resources, r => r.operations), computeGraphQLNamedExports)).sort(),
      moduleName: 'graphql',
    }),
    new ImportDeclaration({
      namedExports: uniq(flatMap(flatMap(service.resources, r => r.operations), computeScalarExports)).sort(),
      moduleName: './scalars',
    }),
  ];

  const resultTypes = flatMap(service.resources, r => r.operations).map(op => getBaseType(op.resultType));
  const argTypes = flatMap(flatMap(service.resources, r => r.operations), op => op.arguments).map(arg => getBaseType(arg.type));

  return resultTypes.concat(argTypes)
    .filter(baseType => !isPrimitiveType(baseType))
    .reduce((declarations, baseType) => {
      // Compute relative path to target module, which is the type we want to
      // import into the generated model.
      const declaration = toImportDeclaration(service, baseType);
      const isAlreadyImported = some(declarations, { moduleName: declaration.moduleName });
      // TODO: Check for possible default export name collision.
      return isAlreadyImported ? declarations : declarations.concat(declaration);
    }, initialImportDeclarations);
}

/**
 * Generates source file content for API Builder enum types.
 * @param {Service} service
 */
function generateCode(service) {
  const templatePath = path.resolve(__dirname, './templates/schema.ejs');
  const importDeclarations = mapToImportDeclarations(service);
  const config = GraphQLSchemaConfig.fromService(service);
  return renderTemplate(templatePath, { config, importDeclarations });
}

/**
 * Create API Builder file containing generated GraphQL query schema from
 * provided API Builder service
 * @param {ApiBuilderService} service
 * @returns {ApiBuilderFile}
 */
function generateFile(service) {
  const destinationPath = destinationPathFromService(service);
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const contents = generateCode(service);
  return new ApiBuilderFile(basename, dirname, contents);
}


exports.generateFile = generateFile;
