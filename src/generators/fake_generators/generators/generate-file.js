const curry = require('lodash/fp/curry');

const generateEnumFile = require('./generate-enum-file');
const generateModelFile = require('./generate-model-file');
const generateUnionFile = require('./generate-union-file');

/**
 * Create a GeneratedFile representing the fake_generator JavaScript code to be written to the
 * filesystem.
 *
 * @param {Object} entity - An object representing an apibuilder enum, model or union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {GeneratedFile} - a file to eventually be written to the filesystem
 */
function generateFile(service, entity) {
  switch (entity.type) {
    case 'enum':
      return generateEnumFile(entity, service);
    case 'model':
      return generateModelFile(entity, service);
    case 'union':
      return generateUnionFile(entity, service);
    default:
      throw new Error(`Unknown Entity Type: ${entity.type}`);
  }
}

module.exports = curry(generateFile);
