const curry = require('lodash/fp/curry');
const defaultTo = require('lodash/fp/defaultTo');
const find = require('lodash/fp/find');

/**
 * Find an entity by its name.
 *
 * @param {String} name - The name of the entity, aka 'address'
 * @param {Array[Object]} entities - A list of entities to search against
 *
 * @returns The matched entity, otherwise undefined.
 */
const findEntityByName = curry((name, entities) =>
  find({ name }, entities));

/**
 * Find an entity by its id.
 *
 * @param {String} id - The name of the entity, aka 'io.flow.common.v0.models.address'
 * @param {Array[Object]} entities - A list of entities to search against
 *
 * @returns The matched entity, otherwise undefined.
 */
const findEntityById = curry((id, entities) =>
  find({ id }, entities));

/**
 * Find an entity by its id or name.
 *
 * @param {String} value - The name or id of the entity, aka 'address' or
 *                         'io.flow.common.v0.models.address'
 * @param {Array[Object]} entities - A list of entities to search against
 *
 * @returns The matched entity, otherwise undefined.
 */
const findEntity = curry((value, entities) =>
  defaultTo(findEntityByName(value, entities), findEntityById(value, entities)));

module.exports = {
  findEntityByName,
  findEntityById,
  findEntity,
};
