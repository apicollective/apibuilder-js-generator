const map = require('lodash/map');
const Entity = require('./Entity');
const FullyQualifiedType = require('./FullyQualifiedType');

class Union extends Entity {
  constructor(schema, fullyQualifiedType, service) {
    super(fullyQualifiedType, service);

    Object.defineProperty(this, 'schema', {
      enumerable: true,
      value: schema,
    });

    Object.defineProperty(this, 'types', {
      get() {
        return map(this.schema.types, ({ type }) => Entity.fromType(type, service));
      },
    });
  }
}

/**
 * Returns the Union corresponding to the specified API Builder union definition.
 * @param {Object} schema An object representing an API Builder union definition.
 * @param {Service} service
 * @param {String} [namespace = service.namespace]
 * @returns {FullyQualifiedType}
 */
Union.fromSchema = function fromSchema(schema, service, namespace = service.namespace) {
  const fullyQualifiedType = new FullyQualifiedType(`${namespace}.unions.${schema.name}`);
  return new Union(schema, fullyQualifiedType, service);
};

module.exports = Union;
