const map = require('lodash/map');
const Entity = require('./Entity');
const FullyQualifiedType = require('./FullyQualifiedType');
const UnionType = require('./UnionType');

/** @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union */
class Union extends Entity {
  constructor(config, fullyQualifiedType, service) {
    super(fullyQualifiedType, service);

    Object.defineProperties(this, {
      /** @property {!String} */
      name: {
        enumerable: true,
        value: config.name,
      },
      /** @property {!String} */
      plural: {
        enumerable: true,
        value: config.plural,
      },
      /** @property {?String} */
      discriminator: {
        enumerable: true,
        value: config.discriminator,
      },
      /** @property {?String} */
      description: {
        enumerable: true,
        value: config.description,
      },
      /** @property {?Object} */
      deprecation: {
        enumerable: true,
        value: config.deprecation,
      },
      /** @property {!UnionType[]} */
      types: {
        enumerable: true,
        value: map(config.types, type => new UnionType(type, service)),
      },
      /** @property {!Object[]} */
      attributes: {
        enumerable: true,
        value: config.attributes,
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
