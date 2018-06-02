const matchesProperty = require('lodash/matchesProperty');
const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const { isPrimitiveType } = require('../../../../utilities/apibuilder');
const GraphQLUnionType = require('../../utilities/GraphQLUnionType');
const ImportDeclaration = require('../../../../utilities/language/ImportDeclaration');
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
 * Given an ApiBuilderUnion, generates the source code for a GraphQLUnionType.
 * @param {ApiBuilderUnion} union
 */
function generateCode(union) {
  const templatePath = path.resolve(__dirname, './templates/GraphQLUnionType.ejs');
  return renderTemplate(templatePath, {
    importDeclarations: getImportDeclarations(union),
    union: GraphQLUnionType.fromApiBuilderUnion(union),
  });
}

module.exports = generateCode;
