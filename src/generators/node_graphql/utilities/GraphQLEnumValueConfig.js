class GraphQLEnumValueConfig {
  constructor(config = {}) {
    Object.defineProperties(this, {
      /** @property {?*} */
      value: {
        enumerable: true,
        value: config.value,
      },
      /** @property {?String} */
      deprecationReason: {
        enumerable: true,
        value: config.deprecationReason,
      },
      /** @property {?String} */
      description: {
        enumerable: true,
        value: config.description,
      },
    });
  }

  /**
   * Creates a GraphQLEnumValueConfig from an ApiBuilderEnumValue instance.
   * @param {ApiBuilderEnumValue} value
   */
  static fromEnumValue(value) {
    return new GraphQLEnumValueConfig({
      value: value.value,
      deprecationReason: value.deprecation && value.deprecation.description,
      description: value.description,
    });
  }
}

module.exports = GraphQLEnumValueConfig;
