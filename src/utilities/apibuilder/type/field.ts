import { get } from 'lodash';
import { ApiBuilderType, astFromTypeName, typeFromAst } from '..';

/**
 * @typedef {Object} ApiBuilderFieldConfig
 * @see https://app.apibuilder.io/apicollective/apibuilder-spec/latest#model-field
 */
export class ApiBuilderField {
  /**
   * Returns instance corresponding to the specified API builder field definition.
   * @param {ApiBuilderFieldConfig} config
   * @param {ApiBuilderService} service
   */
  static fromSchema(config, service) {
    return new ApiBuilderField(config, service);
  }

  config: any;
  service: any;

  /**
   * Create an ApiBuilderField
   * @param {ApiBuilderFieldConfig} config
   * @param {ApiBuilderService} service
   */
  constructor(config, service) {
    this.config = config;
    this.service = service;
  }

  get name(): string {
    return this.config.name;
  }

  get type(): ApiBuilderType {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description(): string {
    return this.config.description;
  }

  get isRequired(): boolean {
    return this.config.required;
  }

  get default(): string {
    return this.config.default;
  }

  get example(): string {
    return this.config.example;
  }

  get minimum(): number {
    return this.config.minimum;
  }

  get maximum(): number {
    return this.config.maximum;
  }

  get attributes(): any[] {
    return this.config.attributes;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get deprecationReason(): string {
    return get(this, 'deprecation.description');
  }

  toString() {
    return this.name;
  }
}
