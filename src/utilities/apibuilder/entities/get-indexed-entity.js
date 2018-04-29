const isEmpty = require('lodash/fp/isEmpty');
const flattenDeep = require('lodash/fp/flattenDeep');
const negate = require('lodash/fp/negate');
const uniqBy = require('lodash/fp/uniqBy');
const DebugLogger = require('debug');

const getRootType = require('../utilities/get-root-type');
const UniqueEntitySearch = require('./unique-entity-search');

const debug = DebugLogger('apibuilder:entities');

/**
 * Get a list of child entities entities for the provided one. Looks up the provided entity by name
 * or id and then recurses over its child entities returning a unique list of entities encountered.
 *
 * @param {String} name - The name of an entity, either by its name or id
 * @param {Array[Object]} entities - A list of entities to search against
 *
 * @returns A list of entities related to the provided one. Including the provided entity.
 */
function getIndexedEntity(name, entities) {
  debug(`[getIndexedEntity] name[${name}]`);
  const entitySearch = new UniqueEntitySearch(entities);
  const walk = (entity = {}) => {
    switch (entity.type) {
      case 'enum':
        return [entity];
      case 'union':
        return [entity, ...entity.entity.types.map(t => walk(entitySearch.findUnique(t.type)))];
      case 'model':
        return [
          entity,
          ...entity.entity.fields.map((field) => {
            const matchingEntity = entitySearch.findUnique(getRootType(field.type));

            if (matchingEntity) {
              return walk(matchingEntity);
            }

            return undefined;
          }).filter(negate(isEmpty)),
        ];
      default:
        return [];
    }
  };

  return uniqBy(
    e => e.id,
    flattenDeep(walk(entitySearch.findUnique(name))),
  );
}

module.exports = getIndexedEntity;
