import { astFromTypeName, typeFromAst } from '..';
import { ApiBuilderService } from './service';

/**
 * @typedef {Object} ApiBuilderUnionTypeConfig
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union_type
 * @property {!String} type
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!Object[]} attributes
 * @property {?Boolean} default
 */
export class ApiBuilderUnionType {
  /**
   * Returns the ApiBuilderUnionType corresponding to the specified API builder
   * union type definition.
   * @param {ApiBuilderUnionTypeConfig} config
   */
  public static fromSchema(config, service: ApiBuilderService) {
    return new ApiBuilderUnionType(config, service);
  }

  private config: any;
  private service: any;

  /**
   * Create an ApiBuilderUnionTypee
   * @param {ApiBuilderUnionTypeConfig} config
   * @param {ApiBuilderService} service
   */
  constructor(config, service) {
    this.config = config;
    this.service = service;
  }

  /** @property {!ApiBuilderType} */
  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /** @property {?Object} */
  get deprecation() {
    return this.config.deprecation;
  }

  /** @property {!Object[]} */
  get attributes() {
    return this.config.attributes;
  }

  /** @property {?Boolean} */
  get default() {
    return this.config.default;
  }

  /** @property {String} */
  get discriminatorValue() {
    // although this field is marked as not required, service.json fills in the type name as default
    return this.config.discriminator_value || this.config.type;
  }

  public toString() {
    return this.config.type;
  }
}
