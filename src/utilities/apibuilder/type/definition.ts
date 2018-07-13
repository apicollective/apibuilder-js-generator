const invariant = require('invariant');
const get = require('lodash/get');
const map = require('lodash/map');
const matches = require('lodash/fp/matches');

const language = require('./language');
import { FullyQualifiedType } from '../utilities/schema';
import { typeFromAst, astFromTypeName } from '../utilities';

/* eslint-disable max-len */

export type ApiBuilderEnclosingType = ApiBuilderArray | ApiBuilderMap;
export type ApiBuilderBaseType = ApiBuilderPrimitiveType | ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion;
export type ApiBuilderType = ApiBuilderEnclosingType | ApiBuilderBaseType;

/* eslint-enable max-len */

/**
 * An array is an enclosing type which points to another type.
 * Arrays are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderArray {
  ofType: ApiBuilderType;

  constructor(ofType) {
    const { isType } = language;
    invariant(isType(ofType), `${String(ofType)} is not an API Builder type.`);
    this.ofType = ofType;
  }

  toString() {
    return `[${String(this.ofType)}]`;
  }
}

/**
 * A map is an enclosing type which points to another type.
 * Maps are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderMap {
  ofType: ApiBuilderType;

  constructor(ofType) {
    const { isType } = language;
    invariant(isType(ofType), `${String(ofType)} is not an API Builder type.`);
    this.ofType = ofType;
  }

  toString() {
    return `map[${String(this.ofType)}]`;
  }
}

export class ApiBuilderPrimitiveType {
  fullyQualifiedType: FullyQualifiedType;

  /**
   * Create an ApiBuilderPrimitiveType
   * @param {FullyQualifiedType} fullyQualifiedType
   */
  constructor(fullyQualifiedType) {
    invariant(
      fullyQualifiedType.isPrimitiveType,
      `${String(fullyQualifiedType)} is not an API builder primitive type.`,
    );

    this.fullyQualifiedType = fullyQualifiedType;
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

  get typeName() {
    return this.fullyQualifiedType.fullyQualifiedType;
  }

  toString() {
    return this.baseType;
  }
}

/**
 * @typedef {Object} ApiBuilderEnumValueConfig
 * @see https://app.apibuilder.io/bryzek/apidoc-spec/latest#model-enum_value
 * @property {!String} name
 * @property {?String} description
 * @property {?String} deprecation
 * @property {!Object[]} attributes
 */
export class ApiBuilderEnumValue {
  config: any;

  /**
   * Create an ApiBuilderEnumValue
   * @param {ApiBuilderEnumValueConfig} config
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * @property {!String}
   * the name of the value.
   */
  get name() {
    return this.config.name;
  }

  /**
   * @property {?String}
   * optional description for what this enum value provides.
   */
  get description() {
    return this.config.description;
  }

  /**
   * @property {?Object[]}
   * additional meta data about enum value.
   */
  get attributes() {
    return this.config.attributes;
  }

  /**
   * @property {?Object}
   * An Object that indicates that this enum value is deprecated.
   */
  get deprecation() {
    return this.config.deprecation;
  }

  toString() {
    return this.name;
  }

  /**
   * Returns the ApiBuilderEnumValue corresponding to the specified API builder
   * enum value definition.
   * @param {ApiBuilderEnumValueConfig} config
   * @returns {ApiBuilderEnumValue}
   */
  static fromSchema(config) {
    return new ApiBuilderEnumValue(config);
  }
}

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
    return map(this.config.values, value =>
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

  /**
   * Returns the ApiBuilderEnum corresponding to the specified enum definition.
   * @param {ApiBuilderEnumConfig} config
   * @param {ApiBuilderService} service
   * @param {String} [namespace = service.namespace]
   * @returns {ApiBuilderEnum}
   */
  static fromSchema(config, service, namespace = service.namespace) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.enums.${config.name}`);
    return new ApiBuilderEnum(config, fullyQualifiedType, service);
  }
}

/**
 * @typedef {Object} ApiBuilderFieldConfig
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

export class ApiBuilderField {
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

  get name() {
    return this.config.name;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get description() {
    return this.config.description;
  }

  get isRequired() {
    return this.config.required;
  }

  get default() {
    return this.config.default;
  }

  get example() {
    return this.config.example;
  }

  get minimum() {
    return this.config.minimum;
  }

  get maximum() {
    return this.config.maximum;
  }

  get attributes() {
    return this.config.attributes;
  }

  get deprecation() {
    return this.config.deprecation;
  }

  get deprecationReason() {
    return get(this, 'deprecation.description');
  }

  toString() {
    return this.name;
  }

  /**
   * Returns instance corresponding to the specified API builder field definition.
   * @param {ApiBuilderFieldConfig} config
   * @param {ApiBuilderService} service
   */
  static fromSchema(config, service) {
    return new ApiBuilderField(config, service);
  }
}


/**
 * Returns whether the type matches str, str_v2, str_v*...
 * @param {ApiBuilderType} type
 * @param {string} str
 */
function typeMatches(type: ApiBuilderBaseType, str: string) {
  return type.fullyQualifiedType.fullyQualifiedType.match(new RegExp(`^${str}(?:_v\\d+)?$`));
}

export class ApiBuilderModel {
  config: any;
  fullyQualifiedType: FullyQualifiedType;
  service: any;

  /**
   * Create an ApiBuilderModel.
   * @param {Object} config - An object representing an API builder model definition.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
   */
  constructor(config, fullyQualifiedType, service) {
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

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /** @property {!ApiBuilderField[]} */
  get fields() {
    return map(this.config.fields, field =>
      ApiBuilderField.fromSchema(field, this.service));
  }

  /** @property {!ApiBuilderOperation} */
  get getter() {
    const { isEnclosingType } = language;
    const resource = this.service.resources.find(resource => resource.type === this);

    if (!resource)
      return undefined;
    
    const getter = resource.operations
      .filter(matches({ method: 'GET' }))
      .filter(op => !isEnclosingType(op.resultType) && typeMatches(op.resultType, this.toString()))
      .sort((a, b) => a.path.length - b.path.length)[0];

    return getter;
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
  static fromSchema(config, service, namespace = service.namespace) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.models.${config.name}`);
    return new ApiBuilderModel(config, fullyQualifiedType, service);
  }
}

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
  config: any;
  service: any;

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

  toString() {
    return this.config.type;
  }

  /**
   * Returns the ApiBuilderUnionType corresponding to the specified API builder
   * union type definition.
   * @param {ApiBuilderUnionTypeConfig} config
   * @param {ApiBuilderService} service
   */
  static fromSchema(config, service) {
    return new ApiBuilderUnionType(config, service);
  }
}

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
    return map(this.config.types, type =>
      ApiBuilderUnionType.fromSchema(type, this.service));
  }

  /** @property {!Object[]} */
  get attributes() {
    return this.config.attributes;
  }

  toString() {
    return this.baseType;
  }

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
}
