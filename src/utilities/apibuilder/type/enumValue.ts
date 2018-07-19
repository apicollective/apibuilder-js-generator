/**
 * @typedef {Object} ApiBuilderEnumValueConfig
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum_value
 */
export class ApiBuilderEnumValue {
  /**
   * Returns the ApiBuilderEnumValue corresponding to the specified API builder
   * enum value definition.
   */
  public static fromSchema(config) {
    return new ApiBuilderEnumValue(config);
  }

  private config: any;

  /**
   * Create an ApiBuilderEnumValue
   * @param {ApiBuilderEnumValueConfig} config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * the name of the value.
   */
  get name(): string {
    return this.config.name;
  }

  /**
   * optional description for what this enum value provides.
   */
  get description(): string {
    return this.config.description;
  }

  /**
   * additional meta data about enum value.
   */
  get attributes(): object[] {
    return this.config.attributes;
  }

  /**
   * @property {?Object}
   * An Object that indicates that this enum value is deprecated.
   */
  get deprecation(): object {
    return this.config.deprecation;
  }

  public toString() {
    return this.name;
  }
}
