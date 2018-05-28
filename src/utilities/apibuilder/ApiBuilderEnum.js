const map = require('lodash/map');

const ApiBuilderType = require('./ApiBuilderType');
const ApiBuilderEnumValue = require('./ApiBuilderEnumValue');
const FullyQualifiedType = require('./FullyQualifiedType');

/**
 * @typedef {ApiBuilderEnumSchema} An object representing an API builder enum definition.
 * @property {!String} name
 * @property {!String} plural
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!EnumValue} values
 * @property {Object[]} attributes
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum
 */

class ApiBuilderEnum extends ApiBuilderType {
  /**
   * Create an ApiBuilderEnum.
   * @param {ApiBuilderEnumSchema} schema
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
      /** @property {!ApiBuilderEnumValue} */
      values: {
        enumerable: true,
        value: map(schema.values, value => new ApiBuilderEnumValue(value)),
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
 * Returns the ApiBuilderEnum corresponding to the specified enum definition.
 * @param {ApiBuilderEnumSchema} schema
 * @param {ApiBuilderService} service
 * @param {String} [namespace = service.namespace]
 * @returns {ApiBuilderEnum}
 */
ApiBuilderEnum.fromSchema = function fromSchema(schema, service, namespace = service.namespace) {
  const fullyQualifiedType = new FullyQualifiedType(`${namespace}.enums.${schema.name}`);
  return new ApiBuilderEnum(schema, fullyQualifiedType, service);
};


module.exports = ApiBuilderEnum;
