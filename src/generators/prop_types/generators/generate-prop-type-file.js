const curry = require('lodash/fp/curry');

const generateEnumPropTypeFile = require('./generate-enum-prop-type-file');
const generateModelPropTypeFile = require('./generate-model-prop-type-file');
const generateUnionPropTypeFile = require('./generate-union-prop-type-file');

/**
 * Create a GeneratedFile representing the PropType JavaScript code to be written to the filesystem.
 *
 * @param {Object} entity - An object representing an apibuilder enum, model or union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generatePropTypeFile(service, entity) {
  switch (entity.type) {
    case 'enum':
      return generateEnumPropTypeFile(entity, service);
    case 'model':
      return generateModelPropTypeFile(entity, service);
    case 'union':
      return generateUnionPropTypeFile(entity, service);
    default:
      throw new Error(`Unknown Entity Type: ${entity.type}`);
  }
}

module.exports = curry(generatePropTypeFile);
