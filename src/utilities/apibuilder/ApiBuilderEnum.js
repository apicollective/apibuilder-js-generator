const map = require('lodash/map');

const Entity = require('./Entity');
const EnumValue = require('./EnumValue');
const FullyQualifiedType = require('./FullyQualifiedType');

class ApiBuilderEnum extends Entity {
  /**
   * Create an ApiBuilderEnum.
   * @param {Object} schema - An object representing an API builder enum definition.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService}
   */
  constructor(schema, fullyQualifiedType, service) {
    super(fullyQualifiedType, service);

    Object.defineProperties(this, {
      /** @property {!String} */
      name: {
        enumerable: true,
        value: schema.name,
      },
      /** @property {?String} */
      plural: {
        enumerable: true,
        value: schema.plural,
      },
      /** @property {?String} */
      description: {
        enumerable: true,
        value: schema.description,
      },
      /** @property {!EnumValue} */
      values: {
        enumerable: true,
        value: map(schema.values, value => new EnumValue(value)),
      },
      /** @property {?Object[]} */
      attributes: {
        enumerable: true,
        value: schema.attributes,
      },
      /** @property {Object} */
      deprecation: {
        enumerable: true,
        value: schema.deprecation,
      },
    });
  }
}

/**
 * Returns the FullyQualifiedType corresponding to the specified enumeration definition.
 * @param {Object} schema An object representing an API Builder enumeration definition.
 * @param {ApiBuilderService} service
 * @param {String} [namespace = service.namespace]
 * @returns {FullyQualifiedType}
 */
ApiBuilderEnum.fromSchema = function fromSchema(schema, service, namespace = service.namespace) {
  const fullyQualifiedType = new FullyQualifiedType(`${namespace}.enums.${schema.name}`);
  return new ApiBuilderEnum(schema, fullyQualifiedType, service);
};


module.exports = ApiBuilderEnum;
