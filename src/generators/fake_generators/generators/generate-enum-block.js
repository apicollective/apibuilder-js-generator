const map = require('lodash/fp/map');

/**
 * Create a GeneratedFile representing the fake_generator JavaScript code for a enum apibuilder
 * entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateEnumBlock(entity) {
  const { entity: { values } } = entity;
  const valuesAsStrings = map(value => `'${value.name}'`, values);

  let code = '';
  code += `const values = [${valuesAsStrings.join(', ')}];`;
  code += '\nreturn faker.random.arrayElement(values);';

  return {
    dependencies: ['faker'],
    code,
  };
}

module.exports = generateEnumBlock;
