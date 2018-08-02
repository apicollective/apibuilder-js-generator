const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const toExportStatement = require('../../utilities/toExportStatement');

function shortNameCompare(a, b) {
  if (a.shortName > b.shortName) {
    return 1;
  }
  if (a.shortName < b.shortName) {
    return -1;
  }
  return 0;
}

function generate(types, rootPath) {
  const templatePath = path.resolve(__dirname, './templates/index.ejs');
  const exportStatements = types
    .sort(shortNameCompare)
    .map(type => toExportStatement(type, rootPath));
  return renderTemplate(templatePath, { exportStatements });
}

module.exports = generate;
