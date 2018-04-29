const kebabCase = require('lodash/fp/kebabCase');

const GeneratedFile = require('../../../utilities/apibuilder/generators/generated-file');
const generatePropType = require('./generate-prop-type');
const getGeneratedSubEntities = require('../utilities/get-generated-sub-entities');

/**
 * Create a GeneratedFile representing the PropType JavaScript code for a union apibuilder entity.
 *
 * @param {Object} entity - An object representing an apibuilder union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateUnionPropTypeFile(entity, service) {
  const entityType = entity.type;
  const fileName = `${kebabCase(entity.name)}.js`;

  let contents = 'import PropTypes from \'prop-types\';\n\n';
  contents += getGeneratedSubEntities(entity, service);
  contents += `\n\nconst generatedPropType = () => ${generatePropType(entity, service)}`;
  contents += '\n\nexport default generatedPropType;\n';


  return new GeneratedFile(`${entityType}/${fileName}`, contents);
}

module.exports = generateUnionPropTypeFile;
