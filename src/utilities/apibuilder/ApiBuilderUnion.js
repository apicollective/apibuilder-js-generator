const map = require('lodash/map');
const ApiBuilderType = require('./ApiBuilderType');
const FullyQualifiedType = require('./FullyQualifiedType');
const ApiBuilderUnionType = require('./ApiBuilderUnionType');

/** @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union */
class ApiBuilderUnion extends ApiBuilderType {
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
      /** @property {!ApiBuilderUnionType[]} */
      types: {
        enumerable: true,
        value: map(config.types, type => new ApiBuilderUnionType(type, service)),
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
 * Returns the ApiBuilderUnion corresponding to the specified API Builder union definition.
 * @param {Object} schema An object representing an API Builder union definition.
 * @param {ApiBuilderService} service
 * @param {String} [namespace = service.namespace]
 * @returns {ApiBuilderUnion}
 */
ApiBuilderUnion.fromSchema = function fromSchema(schema, service, namespace = service.namespace) {
  const fullyQualifiedType = new FullyQualifiedType(`${namespace}.unions.${schema.name}`);
  return new ApiBuilderUnion(schema, fullyQualifiedType, service);
};

module.exports = ApiBuilderUnion;
