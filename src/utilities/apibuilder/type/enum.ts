import invariant = require('invariant');
import { map } from 'lodash';
import { ApiBuilderEnumValue, FullyQualifiedType } from '..';
import { ApiBuilderService } from './service';

/**
 * An object representing an API builder enum definition.
 * @typedef {Object} ApiBuilderEnumConfig
 * @property {!String} name
 * @property {!String} plural
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!EnumValue} values
 * @property {Object[]} attributes
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum
 */
export class ApiBuilderEnum {
  /**
   * Returns the ApiBuilderEnum corresponding to the specified enum definition.
   * @param {ApiBuilderEnumConfig} config
   */
  static fromSchema(config, service: ApiBuilderService, namespace: string = service.namespace) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.enums.${config.name}`);
    return new ApiBuilderEnum(config, fullyQualifiedType, service);
  }

  config: any;
  fullyQualifiedType: FullyQualifiedType;
  service: any;

  /**
   * Create an ApiBuilderEnum.
   * @param {ApiBuilderEnumConfig} config
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService}
   */
  constructor(config, fullyQualifiedType, service) {
    invariant(
      !fullyQualifiedType.isEnclosingType,
      `${String(fullyQualifiedType)} is a collection type. ` +
      'You cannot create an enumeration from a collection type.',
    );

    invariant(
      !fullyQualifiedType.isPrimitiveType,
      `${String(fullyQualifiedType)} is a primitive type. ` +
      'You cannot create an enumeration from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedType = fullyQualifiedType;
    this.service = service;
  }

  /** @property {!String} */
  get baseType() {
    return this.fullyQualifiedType.baseType;
  }

  /** @property {!String} */
  get shortName() {
    return this.fullyQualifiedType.shortName;
  }

  /** @property {!String} */
  get packageName() {
    return this.fullyQualifiedType.packageName;
  }

  /** @property {!String} */
  get name() {
    return this.config.name;
  }

  /** @property {?String} */
  get plural() {
    return this.config.plural;
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /** @property {!ApiBuilderEnumValue[]} */
  get values() {
    return map(this.config.values, (value) =>
      ApiBuilderEnumValue.fromSchema(value));
  }

  /** @property {?Object[]} */
  get attributes() {
    return this.config.attributes;
  }

  /** @property {Object} */
  get deprecation() {
    return this.config.deprecation;
  }

  toString() {
    return this.baseType;
  }
}
