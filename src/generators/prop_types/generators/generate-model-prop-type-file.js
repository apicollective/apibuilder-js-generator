const GeneratedFile = require('../../../utilities/apibuilder/generators/generated-file');
const generatePropType = require('./generate-prop-type');
const toDefaultExport = require('../utilities/to-default-export');

/**
 * Create a GeneratedFile representing the PropType JavaScript code for a model apibuilder entity.
 *
 * @param {Object} entity - An object representing an apibuilder model
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateModelPropTypeFile(entity, service) {
  const entityType = entity.type;
  const fileName = `${toDefaultExport(entity.name)}.js`;
  const content = generatePropType(entity, service);
  return new GeneratedFile(`${entityType}/${fileName}`, content);
}

module.exports = generateModelPropTypeFile;
