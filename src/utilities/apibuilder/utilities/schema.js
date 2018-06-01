const invariant = require('invariant');
const includes = require('lodash/includes');
const ast = require('./ast');

const EMPTY_STRING = '';
const ARRAYOF_REGEX = /^\[(.+)\]$/;
const OBJECTOF_REGEX = /^map\[(.+)\]$/;

const Kind = {
  ARRAY: 'array',
  BOOLEAN: 'boolean',
  DATE_ISO8601: 'date-iso8601',
  DATE_TIME_ISO8601: 'date-time-iso8601',
  DECIMAL: 'decimal',
  DOUBLE: 'double',
  INTEGER: 'integer',
  JSON: 'json',
  LONG: 'long',
  MAP: 'map',
  OBJECT: 'object',
  STRING: 'string',
  UNIT: 'unit',
  UUID: 'uuid',
};

exports.Kind = Kind;

/**
 * Given the name of a type as it appears in an API builder schema, returns
 * whether it is a representation of a map type.
 * @example
 * isMapTypeName("map[string]");
 * //=> true
 * isMapTypeName("string");
 * //=> false
 * @param {String} type
 * @returns {Boolean}
 */
function isMapTypeName(type) {
  return OBJECTOF_REGEX.test(type);
}

exports.isMapTypeName = isMapTypeName;

/**
 * Given the name of a type as it appears in an API builder schema, returns
 * whether it is a representation of an array type.
 * @example
 * isArrayTypeName("[string]");
 * //=> true
 * isArrayTypeName("string");
 * //=> false
 * @param {String} type
 * @returns {Boolean}
 */
function isArrayTypeName(type) {
  return ARRAYOF_REGEX.test(type);
}

exports.isArrayTypeName = isArrayTypeName;

/**
 * API Builder types can be complex (e.g. array of strings, map of strings,
 * maps of array of strings etc.). By design, all entries in an array or map
 * must be of the same type: this is called the base type.
 * @example
 * getBaseTypeName("map[string]")
 * //=> "string"
 * getBaseTypeName("map[[string]]")
 * //=> "string"
 * @param {String} type
 * @returns {String}
 */
function getBaseTypeName(type) {
  const { astFromTypeName } = ast;

  if (typeof type === 'string') {
    return getBaseTypeName(astFromTypeName(type));
  }

  if (type.type != null) {
    return getBaseTypeName(type.type);
  }

  return type.name;
}

exports.getBaseTypeName = getBaseTypeName;


/**
 * Given the name of an enclosing type as it appears in an API builder schema,
 * returns the API builder type name of the underlying type.
 * @example
 * getNestedTypeName("map[string]");
 * //=> "string"
 * getNestedTypeName("map[[string]]");
 * //=> "[string]"
 * @param {String} type
 * @returns {String}
 */
function getNestedTypeName(type) {
  if (isMapTypeName(type)) {
    const [, $1] = type.match(OBJECTOF_REGEX);
    return $1;
  }

  if (isArrayTypeName(type)) {
    const [, $1] = type.match(ARRAYOF_REGEX);
    return $1;
  }

  return type;
}

exports.getNestedTypeName = getNestedTypeName;


/**
 * Given the name of a type as it appears in an API builder schema, returns
 * whether its base type represents a primitive type.
 * @example
 * isPrimitiveTypeName("string");
 * //=> true
 * isPrimitiveTypeName("map[date_time_iso8601]");
 * // => true
 * isPrimitiveTypeName("[com.bryzek.spec.v0.models.reference]");
 * // => false
 * @param {String} type
 * @returns {Boolean}
 */
function isPrimitiveTypeName(type) {
  return includes([
    Kind.BOOLEAN,
    Kind.DATE_ISO8601,
    Kind.DATE_TIME_ISO8601,
    Kind.DECIMAL,
    Kind.DOUBLE,
    Kind.INTEGER,
    Kind.JSON,
    Kind.LONG,
    Kind.OBJECT,
    Kind.STRING,
    Kind.UNIT,
    Kind.UUID,
  ], getBaseTypeName(type));
}

exports.isPrimitiveTypeName = isPrimitiveTypeName;

class FullyQualifiedType {
  /**
   * Create a fully qualified type.
   * @param {String} fullyQualifiedType
   * @example
   * new FullyQualifiedType("string");
   * new FullyQualifiedType("[string]");
   * new FullyQualifiedType("map[string]");
   * new FullyQualifiedType("com.bryzek.apidoc.common.v0.models.reference");
   * new FullyQualifiedType("[com.bryzek.apidoc.common.v0.models.reference]");
   * new FullyQualifiedType("map[com.bryzek.apidoc.common.v0.models.reference]");
   */
  constructor(fullyQualifiedType) {
    invariant(
      getBaseTypeName(fullyQualifiedType).lastIndexOf('.') >= 0 ||
      isPrimitiveTypeName(fullyQualifiedType),
      `"${fullyQualifiedType}" is not fully qualified type or primitive type. ` +
      'A fully qualified type consists of a package name followed by the ' +
      'base short name. (e.g. "com.bryzek.apidoc.common.v0.models.reference").',
    );

    this.fullyQualifiedType = fullyQualifiedType;
  }

  /**
   * This property holds the fully qualified base type name.
   * @property {String}
   */
  get baseType() {
    return getBaseTypeName(this.fullyQualifiedType);
  }

  /**
   * This property holds the nested type.
   *
   * A nested type is a type defined within the scope of another type, which
   * is called the enclosing type. Only array or map types can enclose
   * another type, which may be any of the supported API builder types,
   * including another array or map.
   *
   * @property {String}
   */
  get nestedType() {
    return getNestedTypeName(this.fullyQualifiedType);
  }

  /**
   * This property holds the base short name.
   * @property {String}
   */
  get shortName() {
    const lastIndex = this.baseType.lastIndexOf('.');
    if (lastIndex === -1) return this.baseType;
    return this.baseType.substring(lastIndex + 1);
  }

  /**
   * This property holds the package name.
   * @property {String}
   */
  get packageName() {
    const lastIndex = this.baseType.lastIndexOf('.');
    if (this.isPrimitiveType || lastIndex === -1) return EMPTY_STRING;
    return this.baseType.substring(0, lastIndex);
  }

  /**
   * This property holds whether this is an array.
   * @property {Boolean}
   */
  get isArrayType() {
    return isArrayTypeName(this.fullyQualifiedType);
  }

  /**
   * This property holds whether this is a map.
   * @property {Boolean}
   */
  get isMapType() {
    return isMapTypeName(this.fullyQualifiedType);
  }

  /**
   * This property holds whether this type is an enclosing type.
   *
   * An enclosing type is a type that encloses another type, which is called
   * the nested type. Only array or map types can enclose another type, which
   * may be one of the supported API builder types, including another array or map.
   *
   * @property {Boolean}
   */
  get isEnclosingType() {
    return this.isArrayType || this.isMapType;
  }

  /**
   * This property holds whether this is a primitive type.
   * @property {Boolean}
   */
  get isPrimitiveType() {
    return isPrimitiveTypeName(this.fullyQualifiedType);
  }

  toString() {
    return this.fullyQualifiedType;
  }
}

exports.FullyQualifiedType = FullyQualifiedType;
