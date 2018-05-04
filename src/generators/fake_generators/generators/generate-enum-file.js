const camelCase = require('lodash/fp/camelCase');
const kebabCase = require('lodash/fp/kebabCase');
const beautify = require('js-beautify').js_beautify;

const GeneratedFile = require('../../../utilities/apibuilder/generators/generated-file');
const generateEnumBlock = require('./generate-enum-block');

/**
 * Create a GeneratedFile representing the fake_generator JavaScript code for a enum apibuilder
 * entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateEnumFile(entity) {
  const entityType = entity.type;
  const fileName = `${kebabCase(entity.name)}.js`;
  const { dependencies, code } = generateEnumBlock(entity);
  const requires = dependencies.map(dependency =>
    `const ${camelCase(dependency)} = require('${dependency}');`);

  let contents = requires.join('\n');
  contents += `\n\nconst generate = () => {\n${code}\n};`;
  contents += '\n\nmodule.exports = generate;\n';

  return new GeneratedFile(`${entityType}/${fileName}`, beautify(contents, { indent_size: 2, end_with_newline: true }));
}

module.exports = generateEnumFile;
