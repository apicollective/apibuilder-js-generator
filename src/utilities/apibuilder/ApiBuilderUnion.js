const invariant = require('invariant');
const map = require('lodash/map');

const FullyQualifiedType = require('./FullyQualifiedType');
const ApiBuilderUnionType = require('./ApiBuilderUnionType');

/**
 * @typedef {Object} ApiBuilderUnionSchema
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union
 * @property {!String} name
 * @property {!String} plural
 * @property {?String} discriminator
 * @property {?String} description
 * @property {?Object} deprecation
 * @property {!ApiBuilderUnionType[]} types
 * @property {!Object[]} attributes
 */

class ApiBuilderUnion {
  /**
   * Create an ApiBuilderUnion
   * @param {ApiBuilderUnionSchema} schema
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
   */
  constructor(schema, fullyQualifiedType, service) {
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

  /** @property {!String} */
  get name() {
    return this.schema.name;
  }

  /** @property {!String} */
  get plural() {
    return this.schema.plural;
  }

  /** @property {?String} */
  get discriminator() {
    return this.schema.discriminator;
  }

  /** @property {?String} */
  get description() {
    return this.schema.description;
  }

  /** @property {?Object} */
  get deprecation() {
    return this.schema.deprecation;
  }

  /** @property {!ApiBuilderUnionType[]} */
  get types() {
    return map(this.schema.types, type =>
      ApiBuilderUnionType.fromSchema(type, this.service));
  }

  /** @property {!Object[]} */
  get attributes() {
    return this.schema.attributes;
  }

  toString() {
    return this.baseType;
  }
}

/**
 * Returns the ApiBuilderUnion corresponding to the specified API Builder union definition.
 * @param {ApiBuilderUnionSchema} schema An object representing an API Builder union definition.
 * @param {ApiBuilderService} service
 * @param {String} [namespace = service.namespace]
 * @returns {ApiBuilderUnion}
 */
ApiBuilderUnion.fromSchema = function fromSchema(schema, service, namespace = service.namespace) {
  const fullyQualifiedType = new FullyQualifiedType(`${namespace}.unions.${schema.name}`);
  return new ApiBuilderUnion(schema, fullyQualifiedType, service);
};

module.exports = ApiBuilderUnion;
