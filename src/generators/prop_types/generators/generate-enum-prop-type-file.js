const kebabCase = require('lodash/fp/kebabCase');

const GeneratedFile = require('../../../utilities/apibuilder/generators/generated-file');
const generatePropType = require('./generate-prop-type');

/**
 * Create a GeneratedFile representing the PropType JavaScript code for a enum apibuilder entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateEnumPropTypeFile(entity, service) {
  const entityType = entity.type;
  const fileName = `${kebabCase(entity.name)}.js`;

  let contents = 'import PropTypes from \'prop-types\';\n';
  contents += `\n\nconst generatedPropType = () => ${generatePropType(entity, service)}`;
  contents += '\n\nexport default generatedPropType;\n';

  return new GeneratedFile(`${entityType}/${fileName}`, contents);
}

module.exports = generateEnumPropTypeFile;
