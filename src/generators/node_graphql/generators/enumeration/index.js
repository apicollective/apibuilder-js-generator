const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const toDefaultExport = require('../../utilities/toDefaultExport');
const GraphQLEnumType = require('../../utilities/GraphQLEnumType');

/**
 * Generates code for a GraphQLEnumType from an ApiBuilderEnum.
 * @param {ApiBuilderEnum} enumeration
 * @returns {String}
 */
function generateCode(enumeration) {
  const templatePath = path.resolve(__dirname, './templates/GraphQLEnumType.ejs');
  return renderTemplate(templatePath, {
    exportName: toDefaultExport(enumeration),
    enumeration: GraphQLEnumType.fromApiBuilderEnum(enumeration),
  });
}

module.exports = generateCode;
