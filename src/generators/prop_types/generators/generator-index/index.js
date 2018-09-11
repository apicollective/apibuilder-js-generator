const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');

function generate(types, rootPath) {
  const templatePath = path.resolve(__dirname, './templates/index.ejs');
  return renderTemplate(templatePath);
}

module.exports = generate;
