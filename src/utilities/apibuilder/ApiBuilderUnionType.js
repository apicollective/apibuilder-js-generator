const astFromType = require('./astFromType');
const typeFromAst = require('./typeFromAst');

/**
 * @typedef {Object} ApiBuilderUnionTypeSchema
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union_type
 * @property {!String} type
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!Object[]} attributes
 * @property {?Boolean} default
 */

class ApiBuilderUnionType {
  /**
   * Create an ApiBuilderUnionTypee
   * @param {ApiBuilderUnionTypeSchema} schema
   * @param {ApiBuilderService} service
   */
  constructor(schema, service) {
    this.schema = schema;
    this.service = service;
  }

  /** @property {!ApiBuilderType} */
  get type() {
    return typeFromAst(astFromType(this.schema.type), this.service);
  }

  /** @property {?String} */
  get description() {
    return this.schema.description;
  }

  /** @property {?Object} */
  get deprecation() {
    return this.schema.deprecation;
  }

  /** @property {!Object[]} */
  get attributes() {
    return this.schema.attributes;
  }

  /** @property {?Boolean} */
  get default() {
    return this.schema.default;
  }

  toString() {
    return this.schema.type;
  }

  /**
   * Returns the ApiBuilderUnionType corresponding to the specified API builder
   * union type definition.
   * @param {ApiBuilderUnionTypeSchema} schema
   * @param {ApiBuilderService} service
   */
  static fromSchema(schema, service) {
    return new ApiBuilderUnionType(schema, service);
  }
}

module.exports = ApiBuilderUnionType;
