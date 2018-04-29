const camelCase = require('lodash/fp/camelCase');
const curry = require('lodash/fp/curry');
const map = require('lodash/fp/map');

const generatePropType = require('../generators/generate-prop-type');
const { filterApiInternalOnly } = require('./hacks');

/**
 * Returns a string code snippet that represents the assignment of a PropType definition to a
 * variable.
 *
 * @param {Object} entity - An object representing an apibuilder enum, model or union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {String} - A code snippet for the PropType
 */
const createPropTypeAssignment = curry((service, entity) =>
  `const ${camelCase(`${entity.name}_prop_type`)} = () => ${generatePropType(entity, service)}`);

/**
 * Given the provided `entity`, looks up all child entities for the `service`. Generates a code
 * snippet for each entity found.
 *
 * @param {Object} entity - An object representing an apibuilder enum, model or union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {String} - The code for all of the child entities
 */
function getGeneratedSubEntities(entity, service) {
  let indexedEntities =
    service
      .getIndexedEntity(entity.name, service.getIndexed())
      .filter(childEntity => childEntity.name !== entity.name);

  // Hack to avoid duplicate entities from 3rd party / external apis that are imported to
  // api-internal. Favors the io.flow.internal definition over the external one.
  if (service.getApplicationKey() === 'api-internal') {
    indexedEntities = filterApiInternalOnly(service, indexedEntities);
  }

  const assignments = map(createPropTypeAssignment(service), indexedEntities).join('\n\n');
  return `\n${assignments}`;
}

module.exports = getGeneratedSubEntities;
