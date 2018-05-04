const kebabCase = require('lodash/fp/kebabCase');

const GeneratedFile = require('../../../utilities/apibuilder/generators/generated-file');
// const generateFakeGenerator = require('./generate-fake-generator');

/**
 * Create a GeneratedFile representing the fake_generator JavaScript code for a enum apibuilder
 * entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateUnion(entity, service) {
  const entityType = entity.type;
  const fileName = `${kebabCase(entity.name)}.js`;

  let contents = 'const faker = require(\'faker\')';
  contents += `\n\nconst generate = () => {}`;
  contents += '\n\nexport default generate;\n';

  return new GeneratedFile(`${entityType}/${fileName}`, contents);
}

module.exports = generateUnion;
