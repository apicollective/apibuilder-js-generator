/**
 * @typedef {Object} ApiBuilderEnumValueSchema
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum_value
 * @property {!String} name
 * @property {?String} description
 * @property {?String} deprecation
 * @property {!Object[]} attributes
 */

class ApiBuilderEnumValue {
  /**
   * Create an ApiBuilderEnumValue
   * @param {ApiBuilderEnumValueSchema} schema
   */
  constructor(schema) {
    this.schema = schema;
  }

  /**
   * @property {!String}
   * the name of the value.
   */
  get name() {
    return this.schema.name;
  }

  /**
   * @property {?String}
   * optional description for what this enum value provides.
   */
  get description() {
    return this.schema.description;
  }

  /**
   * @property {?Object[]}
   * additional meta data about enum value.
   */
  get attributes() {
    return this.schema.attributes;
  }

  /**
   * @property {?Object}
   * An Object that indicates that this enum value is deprecated.
   */
  get deprecation() {
    return this.schema.deprecation;
  }

  toString() {
    return this.name;
  }

  /**
   * Returns the ApiBuilderEnumValue corresponding to the specified API builder
   * enum value definition.
   * @param {ApiBuilderEnumValueSchema} schema
   * @returns {ApiBuilderEnumValue}
   */
  static fromSchema(schema) {
    return new ApiBuilderEnumValue(schema);
  }
}

module.exports = ApiBuilderEnumValue;
