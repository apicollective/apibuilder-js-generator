const kebabCase = require('lodash/fp/kebabCase');

const GeneratedFile = require('../../../utilities/apibuilder/generators/generated-file');
const generatePropType = require('./generate-prop-type');
const getGeneratedSubEntities = require('../utilities/get-generated-sub-entities');

/**
 * Create a GeneratedFile representing the PropType JavaScript code for a model apibuilder entity.
 *
 * @param {Object} entity - An object representing an apibuilder model
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateModelPropTypeFile(entity, service) {
  const serviceKey = service.getApplicationKey();
  const entityType = entity.type;
  const fileName = `${kebabCase(entity.name)}.js`;

  let contents = 'import PropTypes from \'prop-types\';\n\n';
  contents += getGeneratedSubEntities(entity, service);
  contents += `\n\nconst generatedPropType = () => ${generatePropType(entity, service)}`;
  contents += '\n\nexport default generatedPropType;\n';

  return new GeneratedFile(`${serviceKey}/${entityType}/${fileName}`, contents);
}

module.exports = generateModelPropTypeFile;
