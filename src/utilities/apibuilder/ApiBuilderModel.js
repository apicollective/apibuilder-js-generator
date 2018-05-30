const invariant = require('invariant');
const map = require('lodash/map');

const ApiBuilderField = require('./ApiBuilderField');
const FullyQualifiedType = require('./FullyQualifiedType');

class ApiBuilderModel {
  /**
   * Create an ApiBuilderModel.
   * @param {Object} schema - An object representing an API builder model definition.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
   */
  constructor(schema, fullyQualifiedType, service) {
    invariant(
      !fullyQualifiedType.isEnclosingType,
      `${String(fullyQualifiedType)} is a collection type. ` +
      'You cannot create an model from a collection type.',
    );

    invariant(
      !fullyQualifiedType.isPrimitiveType,
      `${String(fullyQualifiedType)} is a primitive type. ` +
      'You cannot create an model from a primitive type.',
    );

    this.schema = schema;
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

  /** @property {?String} */
  get description() {
    return this.schema.description;
  }

  /** @property {!ApiBuilderField[]} */
  get fields() {
    return map(this.schema.fields, field =>
      ApiBuilderField.fromSchema(field, this.service));
  }

  toString() {
    return this.baseType;
  }

  /**
   * Returns the ApiBuilderModel corresponding to the specified API builder model definition.
   * @param {Object} model An object representing an API Builder model definition.
   * @param {ApiBuilderService} service
   * @param {String} [namespace = service.namespace]
   * @returns {ApiBuilderModel}
   */
  static fromSchema(schema, service, namespace = service.namespace) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.models.${schema.name}`);
    return new ApiBuilderModel(schema, fullyQualifiedType, service);
  }
}

module.exports = ApiBuilderModel;
