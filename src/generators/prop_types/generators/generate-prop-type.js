const DebugLogger = require('debug');
const memoize = require('lodash/fp/memoize');

const generateEnumPropType = require('./generate-enum-prop-type');
const generateUnionPropType = require('./generate-union-prop-type');
const generateModelPropType = require('./generate-model-prop-type');

const debug = DebugLogger('apibuilder-prop-types:generators');

/**
 * Generate code for the PropType definition of an entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum, model or union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {String} - A code snippet for the PropType definition
 */
function generatePropType(entity, service) {
  debug(`generatePropType entity[${entity.name}] service[${service.getApplicationKey()}]`);

  switch (entity.type) {
    case 'enum':
      return generateEnumPropType(entity);
    case 'union':
      return generateUnionPropType(entity);
    case 'model':
      return generateModelPropType(entity, service);
    default:
      throw new Error(`Unhandled entity type[${entity.type}]`);
  }
}

const generatePropTypeMemoized = memoize(generatePropType, (entity, service) => `${service.getApplicationKey()}_${entity.name}`);

module.exports = generatePropTypeMemoized;
