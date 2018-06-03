const invariant = require('invariant');
const map = require('lodash/map');

const ApiBuilderEnumValue = require('./ApiBuilderEnumValue');
const FullyQualifiedType = require('./FullyQualifiedType');

/**
 * @typedef {ApiBuilderEnumSchema} An object representing an API builder enum definition.
 * @property {!String} name
 * @property {!String} plural
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!EnumValue} values
 * @property {Object[]} attributes
 * @see https://app.apibuilder.io/apicollective/apibuilder-spec/latest#model-enum
 */

class ApiBuilderEnum {
  /**
   * Create an ApiBuilderEnum.
   * @param {ApiBuilderEnumSchema} schema
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService}
   */
  constructor(schema, fullyQualifiedType, service) {
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

    this.schema = schema;
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
    return this.schema.name;
  }

  /** @property {?String} */
  get plural() {
    return this.schema.plural;
  }

  /** @property {?String} */
  get description() {
    return this.schema.description;
  }

  /** @property {!ApiBuilderEnumValue[]} */
  get values() {
    return map(this.schema.values, value =>
      ApiBuilderEnumValue.fromSchema(value));
  }

  /** @property {?Object[]} */
  get attributes() {
    return this.schema.attributes;
  }

  /** @property {Object} */
  get deprecation() {
    return this.schema.deprecation;
  }

  toString() {
    return this.baseType;
  }

  /**
   * Returns the ApiBuilderEnum corresponding to the specified enum definition.
   * @param {ApiBuilderEnumSchema} schema
   * @param {ApiBuilderService} service
   * @param {String} [namespace = service.namespace]
   * @returns {ApiBuilderEnum}
   */
  static fromSchema(schema, service, namespace = service.namespace) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.enums.${schema.name}`);
    return new ApiBuilderEnum(schema, fullyQualifiedType, service);
  }
}

module.exports = ApiBuilderEnum;
