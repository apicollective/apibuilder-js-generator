const get = require('lodash/get');
const astFromType = require('./astFromType');
const typeFromAst = require('./typeFromAst');

/**
 * @typedef {Object} ApiBuilderFieldSchema
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-field
 * @property {!String} name
 * @property {!String} type
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {?String} default
 * @property {!Boolean} required
 * @property {?Number} minimum
 * @property {?Number} maximum
 * @property {?String} example
 * @property {!Object[]} attributes
 */

class ApiBuilderField {
  /**
   * Create an ApiBuilderField
   * @param {ApiBuilderFieldSchema} schema
   * @param {ApiBuilderService} service
   */
  constructor(schema, service) {
    this.schema = schema;
    this.service = service;
  }

  get name() {
    return this.schema.name;
  }

  get type() {
    return typeFromAst(astFromType(this.schema.type), this.service);
  }

  get description() {
    return this.schema.description;
  }

  get isRequired() {
    return this.schema.required;
  }

  get default() {
    return this.schema.default;
  }

  get example() {
    return this.schema.example;
  }

  get minimum() {
    return this.schema.minimum;
  }

  get maximum() {
    return this.schema.maximum;
  }

  get attributes() {
    return this.schema.attributes;
  }

  get deprecation() {
    return this.schema.deprecation;
  }

  get deprecationReason() {
    return get(this, 'deprecation.description');
  }

  toString() {
    return this.name;
  }

  /**
   * Returns instance corresponding to the specified API builder field definition.
   * @param {ApiBuilderFieldSchema} schema
   * @param {ApiBuilderService} service
   */
  static fromSchema(schema, service) {
    return new ApiBuilderField(schema, service);
  }
}

module.exports = ApiBuilderField;
