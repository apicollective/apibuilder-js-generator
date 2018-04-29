const pick = require('lodash/fp/pick');

/**
 * Extracts the entities (enums, models, unions) from an apibuilder service definition.
 *
 * @param {Object} service - An apibuilder service definition object
 *
 * @returns The extracted entities from the service.
 */
function getEntities(service) {
  return pick(['enums', 'unions', 'models'], service);
}

module.exports = getEntities;
