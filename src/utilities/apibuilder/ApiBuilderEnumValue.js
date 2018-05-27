const defaultTo = require('lodash/defaultTo');

class ApiBuilderEnumValue {
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
       * @property {!String} the actual string representation of this enum
       * value when serializing.
       */
      value: {
        enumerable: true,
        value: defaultTo(config.value, config.name),
      },
      /**
       * @property {?String} optional description for what this enum
       * value provides.
       */
      description: {
        enumerable: true,
        value: config.description,
      },
      /**
       * @property {?Object[]} JSON array defining additional meta data about
       * this enum value for use by generators.
       */
      attributes: {
        enumerable: true,
        value: config.attributes,
      },
      /**
       * @property {?Object} JSON Object that indicates that this enum is
       * deprecated.
       */
      deprecation: {
        enumerable: true,
        value: config.deprecation,
      },
    });
  }
}

module.exports = ApiBuilderEnumValue;
