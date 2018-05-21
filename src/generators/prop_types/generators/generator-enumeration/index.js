const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const templatePath = path.resolve(__dirname, './templates/enumeration.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

/**
 * Generates source file content for API Builder enum types.
 * @param {Enumeration} enumeration
 */
function generate(enumeration) {
  return compiled({ enumeration });
}

module.exports = generate;
