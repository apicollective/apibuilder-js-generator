const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const toDefaultExport = require('../../utilities/toDefaultExport');
const GraphQLEnumTypeConfig = require('../../utilities/GraphQLEnumTypeConfig');

/**
 * @param {ApiBuilderEnum} enumeration
 */
function generateCode(enumeration) {
  const templatePath = path.resolve(__dirname, './templates/enumeration.ejs');
  return renderTemplate(templatePath, {
    exportName: toDefaultExport(enumeration),
    enumeration: GraphQLEnumTypeConfig.fromEnum(enumeration),
  });
}

module.exports = generateCode;
