class GraphQLEnumValue {
  constructor(config = {}) {
    this.config = config;
  }

  /** @property {?*} */
  get value() {
    return this.config.value;
  }

  /** @property {?String} */
  get deprecationReason() {
    return this.config.deprecationReason;
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /**
   * Creates a GraphQLEnumValue from specified ApiBuilderEnumValue instance.
   * @param {ApiBuilderEnumValue} value
   * @returns {GraphQLEnumValue}
   */
  static formApiBuilderEnumValue(value) {
    // TODO: Validate argument is actually an ApiBuilderEnumValue instance.
    return new GraphQLEnumValue({
      value: value.name,
      deprecationReason: value.deprecation && value.deprecation.description,
      description: value.description,
    });
  }
}

module.exports = GraphQLEnumValue;
