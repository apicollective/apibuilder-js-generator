const fs = require('fs');
const path = require('path');
const defaultTo = require('lodash/defaultTo');
const ejs = require('ejs');

const constantCase = require('../../utilities/constantCase');
const pascalCase = require('../../utilities/pascalCase');

const templatePath = path.resolve(__dirname, './templates/enumeration.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

/**
 * Generates source file content for API Builder enum types.
 * @param {Enumeration} enumeration
 */
function generate(enumeration) {
  return compiled({
    exportName: pascalCase(enumeration.schema.name),
    values: enumeration.schema.values.map(value => ({
      name: constantCase(value.name),
      value: defaultTo(value.value, value.name),
      description: value.description,
      deprecation: value.deprecation,
    })),
  });
}

module.exports = generate;