const defaultTo = require('lodash/defaultTo');
const map = require('lodash/map');

const Entity = require('./Entity');
const FullyQualifiedType = require('./FullyQualifiedType');

class Enumeration extends Entity {
  /**
   * Create an enumeration.
   * @param {Object} schema - An object representing an API builder enum definition.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {Service}
   */
  constructor(schema, fullyQualifiedType, service) {
    super(fullyQualifiedType, service);
    this.schema = schema;

    /**
     * @property {String[]} constants - This property holds an array of strings
     * representing each of the available enumeration values.
     */
    Object.defineProperty(this, 'constants', {
      get() {
        return map(this.schema.values, ({ name, value }) => {
          return defaultTo(value, name);
        });
      },
    });
  }
}

/**
 * Returns the FullyQualifiedType corresponding to the specified enumeration definition.
 * @param {Object} schema An object representing an API Builder enumeration definition.
 * @param {Service} service
 * @param {String} [namespace = service.namespace]
 * @returns {FullyQualifiedType}
 */
Enumeration.fromSchema = function fromSchema(schema, service, namespace = service.namespace) {
  const fullyQualifiedType = new FullyQualifiedType(`${namespace}.enums.${schema.name}`);
  return new Enumeration(schema, fullyQualifiedType, service);
};


module.exports = Enumeration;
