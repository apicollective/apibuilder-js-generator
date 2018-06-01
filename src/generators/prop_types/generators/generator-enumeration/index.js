const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');

/**
 * Generates source file content for ApiBuilderEnum types.
 * @param {ApiBuilderEnum} enumeration
 */
function generate(enumeration) {
  const templatePath = path.resolve(__dirname, './templates/enumeration.ejs');
  return renderTemplate(templatePath, { enumeration });
}

module.exports = generate;
