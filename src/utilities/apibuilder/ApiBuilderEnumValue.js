/**
 * @typedef {Object} ApiBuilderEnumValueConfig
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum_value
 * @property {!String} name
 * @property {?String} description
 * @property {?String} deprecation
 * @property {!Object[]} attributes
 */

class ApiBuilderEnumValue {
  /**
   * Create an ApiBuilderEnumValue
   * @param {ApiBuilderEnumValueConfig} config
   */
  constructor(config) {
    Object.defineProperties(this, {
      /**
       * @property {!String} the name of the value.
       */
      name: {
        enumerable: true,
        value: config.name,
      },
      /**
       * @property {?String} optional description for what this enum value provides.
       */
      description: {
        enumerable: true,
        value: config.description,
      },
      /**
       * @property {?Object[]} additional meta data about enum value.
       */
      attributes: {
        enumerable: true,
        value: config.attributes,
      },
      /**
       * @property {?Object} An Object that indicates that this enum value is deprecated.
       */
      deprecation: {
        enumerable: true,
        value: config.deprecation,
      },
    });
  }
}

module.exports = ApiBuilderEnumValue;
