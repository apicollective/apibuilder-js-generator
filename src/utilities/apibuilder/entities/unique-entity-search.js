const includes = require('lodash/fp/includes');
const { findEntity } = require('./find-entity');

/**
 * UniqueEntitySearch provides the ability to search a list of entities and only return the matching
 * entity if it has not been encountered before. This class simply maintains the state of entities
 * that were previously return.
 */
class UniqueEntitySearch {
  constructor(entities) {
    this.entities = entities;
    this.encounteredEntities = [];
  }

  /**
   * Find an entity by its name or id. Only returns a matching entity on the initial successful
   * search. Subsequent searches will not yield a result.
   *
   * @param {String} query - An entity name or id.
   *
   * @returns A matching entity or undefined if it was not found or already returned.
   */
  findUnique(query) {
    const result = findEntity(query, this.entities);

    if (!result || includes(result.id, this.encounteredEntities)) {
      return undefined;
    }

    this.encounteredEntities.push(result.id);

    return result;
  }
}

module.exports = UniqueEntitySearch;
