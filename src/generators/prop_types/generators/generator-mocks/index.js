const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const shortNameCompare = require('../../utilities/shortNameCompare');
const toExportStatement = require('../../utilities/toExportStatement');

function generate(types, rootPath) {
  const templatePath = path.resolve(__dirname, './templates/mocks.ejs');
  const exportStatements = types
    .sort(shortNameCompare)
    .map(type => toExportStatement(type, rootPath));
  return renderTemplate(templatePath, { exportStatements });
}

module.exports = generate;
