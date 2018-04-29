const concat = require('lodash/fp/concat');
const flattenDeep = require('lodash/fp/flattenDeep');
const map = require('lodash/fp/map');
const method = require('lodash/fp/method');
const uniqBy = require('lodash/fp/uniqBy');

const { getIndexedEntities, getIndexedEntity } = require('./entities');

/**
 * Wraps an apibuilder service definition and provides utilities for interacting with it.
 */
class Service {
  constructor(api, imports) {
    this.api = api;
    this.imports = imports;
    this.indexedEntityCache = {};
  }

  /**
   * Get all of the entities for this service indexed by their id. If imports are loaded then it
   * will merge all of the imports entities with this service.
   *
   * @returns Array - A list of all the entities used in the service.
   */
  getIndexed() {
    if (this.entityIndex) {
      return this.entityIndex;
    }

    const childIndicies = map(method('getIndexed'), this.imports);
    this.entityIndex = uniqBy(
      entity => entity.id,
      flattenDeep(concat(getIndexedEntities(this.api.service), childIndicies)),
    );

    return this.entityIndex;
  }

  /**
   * Get all the dependent entities for the one provided. Takes the provided entity name and finds
   * the full object that represents it. It then finds all related entities using the same approach.
   *
   * @param {String} name - The entity name or id.
   *
   * @returns Array - The entities related to the provided one.
   */
  getIndexedEntity(name) {
    if (this.indexedEntityCache[name]) {
      return this.indexedEntityCache[name];
    }

    this.indexedEntityCache[name] = getIndexedEntity(name, this.getIndexed());

    return this.indexedEntityCache[name];
  }

  /**
   * Return the service name
   */
  getName() {
    return this.api.service.name;
  }

  /**
   * Return the service application key
   */
  getApplicationKey() {
    return this.api.service.application.key;
  }

  /**
   * Return the service organization key
   */
  getOrganizationKey() {
    return this.api.service.organization.key;
  }

  /**
   * Return the service namespace
   */
  getNamespace() {
    return this.api.service.namespace;
  }

  /**
   * Return the service version
   */
  getVersion() {
    return this.api.service.version;
  }
}

module.exports = Service;
