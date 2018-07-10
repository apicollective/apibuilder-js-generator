const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const toExportStatement = require('../../utilities/toExportStatement');

function generate(types, rootPath) {
  const templatePath = path.resolve(__dirname, './templates/index.ejs');
  const exportStatements = types.map(type => toExportStatement(type, rootPath));
  return renderTemplate(templatePath, { exportStatements });
}

module.exports = generate;
