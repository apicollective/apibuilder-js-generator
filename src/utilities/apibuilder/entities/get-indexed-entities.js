const DebugLogger = require('debug');
const get = require('lodash/fp/get');

const getEntities = require('./get-entities');

const debug = DebugLogger('apibuilder:entities');

/**
 * Return apibuilder service entities normalized and indexed by `id`. `id` is
 * the joining of the namespace and entity name. An entity will take the shape:
 *
 * {
 *   id, // io.flow.common.v0.models.address
 *   name, // address
 *   type, // model
 *   entity, // the actual raw model from the service
 * }
 *
 * @param {Object} service - An apibuilder service definition object
 *
 * @returns Returns a list of entity derived from the provided service definition.
 */
function getIndexedEntities(service) {
  debug(`[getIndexedEntities] service applicationKey[${get(service, 'application.key')}]`);
  const { enums = [], unions = [], models = [] } = getEntities(service);
  debug(`[getIndexedEntities] enums[${enums.length}], unions[${unions.length}], models[${models.length}]`);
  const { namespace } = service;
  const indexedEnums = enums.map(enm => ({
    id: `${namespace}.enums.${enm.name}`,
    name: enm.name,
    type: 'enum',
    entity: enm,
  }));
  const indexedUnions = unions.map(union => ({
    id: `${namespace}.unions.${union.name}`,
    name: union.name,
    type: 'union',
    entity: union,
  }));
  const indexedModels = models.map(model => ({
    id: `${namespace}.models.${model.name}`,
    name: model.name,
    type: 'model',
    entity: model,
  }));

  return [...indexedEnums, ...indexedUnions, ...indexedModels];
}

module.exports = getIndexedEntities;
