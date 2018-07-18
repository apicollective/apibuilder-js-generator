import invariant = require('invariant');
import { map } from 'lodash';
import { ApiBuilderUnionType, FullyQualifiedType } from '..';

/**
 * @typedef {Object} ApiBuilderUnionConfig
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union
 * @property {!String} name
 * @property {!String} plural
 * @property {?String} discriminator
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!ApiBuilderUnionType[]} types
 * @property {!Object[]} attributes
 */

export class ApiBuilderUnion {
  /**
   * Returns the ApiBuilderUnion corresponding to the specified API Builder
   * union definition.
   * @param {ApiBuilderUnionConfig} config An object representing an API Builder union definition.
   * @param {ApiBuilderService} service
   * @param {String} [namespace = service.namespace]
   * @returns {ApiBuilderUnion}
   */
  static fromSchema(config, service, namespace = service.namespace) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.unions.${config.name}`);
    return new ApiBuilderUnion(config, fullyQualifiedType, service);
  }

  config: any;
  fullyQualifiedType: FullyQualifiedType;
  service: any;

  /**
   * Create an ApiBuilderUnion
   * @param {ApiBuilderUnionConfig} config
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
   */
  constructor(config, fullyQualifiedType, service) {
    invariant(
      !fullyQualifiedType.isEnclosingType,
      `${String(fullyQualifiedType)} is a collection type. ` +
      'You cannot create an union from a collection type.',
    );

    invariant(
      !fullyQualifiedType.isPrimitiveType,
      `${String(fullyQualifiedType)} is a primitive type. ` +
      'You cannot create an union from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedType = fullyQualifiedType;
    this.service = service;
  }

  get baseType() {
    return this.fullyQualifiedType.baseType;
  }

  get shortName() {
    return this.fullyQualifiedType.shortName;
  }

  get packageName() {
    return this.fullyQualifiedType.packageName;
  }

  /** @property {!String} */
  get name() {
    return this.config.name;
  }

  /** @property {!String} */
  get plural() {
    return this.config.plural;
  }

  /** @property {?String} */
  get discriminator() {
    return this.config.discriminator;
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /** @property {?Object} */
  get deprecation() {
    return this.config.deprecation;
  }

  /** @property {!ApiBuilderUnionType[]} */
  get types() {
    return map(this.config.types, (type) =>
      ApiBuilderUnionType.fromSchema(type, this.service));
  }

  /** @property {!Object[]} */
  get attributes() {
    return this.config.attributes;
  }

  toString() {
    return this.baseType;
  }
}
