const ejs = require('ejs');
const fs = require('fs');
const prettier = require('prettier');

function renderTemplate(filepath, data) {
  const template = fs.readFileSync(filepath, 'utf8');
  const compiled = ejs.compile(template, { filename: filepath });
  const code = compiled(data);
  return prettier.format(code, {
    singleQuote: true,
    trailingComma: 'es5',
    parser: 'babylon'
  });
}

exports.renderTemplate = renderTemplate;
