const matchesProperty = require('lodash/matchesProperty');
const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const { ApiBuilderFile, isPrimitiveType } = require('../../../../utilities/apibuilder');
const GraphQLUnionType = require('../../utilities/GraphQLUnionType');
const ImportDeclaration = require('../../../../utilities/language/ImportDeclaration');
const destinationPathFromType = require('../../utilities/destinationPathFromType');
const toImportDeclaration = require('../../utilities/toImportDeclaration');

function getImportDeclarations(union) {
  const initialImportDeclarations = [
    new ImportDeclaration({
      namedExports: ['GraphQLUnionType'],
      moduleName: 'graphql',
    }),
  ];

  return union.types
    .filter(unionType => !isPrimitiveType(unionType.type))
    .reduce((importDeclarations, unionType) => {
      // Compute relative path to target module, which is the type we want to
      // import into the generated GraphQLUnionType.
      const importDeclaration = toImportDeclaration(union, unionType.type);
      const isAlreadyImported = importDeclarations.some(matchesProperty('moduleName', importDeclaration.moduleName));
      // TODO: Check for possible default export name collision.
      return isAlreadyImported ? importDeclarations : importDeclarations.concat(importDeclaration);
    }, initialImportDeclarations);
}

/**
 * Generates the source code for GraphQL union type from provided API Builder
 * union type.
 * @param {ApiBuilderUnion} union
 * @returns {String}
 */
function generateCode(union) {
  const templatePath = path.resolve(__dirname, './templates/GraphQLUnionType.ejs');
  return renderTemplate(templatePath, {
    importDeclarations: getImportDeclarations(union),
    union: GraphQLUnionType.fromApiBuilderUnion(union),
  });
}

exports.generateCode = generateCode;

/**
 * Creates an API builder file containing generated GraphQL union type from
 * specified API builder union.
 * @param {ApiBuilderUnion} union
 * @returns {ApiBuilderFile}
 */
function generateFile(union) {
  const destinationPath = destinationPathFromType(union);
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const contents = generateCode(union);
  return new ApiBuilderFile(basename, dirname, contents);
}

exports.generateFile = generateFile;
