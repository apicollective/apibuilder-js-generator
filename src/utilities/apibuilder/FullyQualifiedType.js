const includes = require('lodash/includes');
const invariant = require('invariant');

const TypeKind = require('./TypeKind');

const EMPTY_STRING = '';
const arrayOfRegex = /^\[(.+)\]$/;
const objectOfRegex = /^map\[(.+)\]$/;

/**
 * An utility class to manipulate types defined as strings.
 */
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
      FullyQualifiedType.getBaseType(fullyQualifiedType).lastIndexOf('.') >= 0 ||
      FullyQualifiedType.isPrimitiveType(fullyQualifiedType),
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
    return FullyQualifiedType.getBaseType(this.fullyQualifiedType);
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
    return FullyQualifiedType.getNestedType(this.fullyQualifiedType);
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
    return FullyQualifiedType.isArrayType(this.fullyQualifiedType);
  }

  /**
   * This property holds whether this is a map.
   * @property {Boolean}
   */
  get isMapType() {
    return FullyQualifiedType.isMapType(this.fullyQualifiedType);
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
    return FullyQualifiedType.isPrimitiveType(this.fullyQualifiedType);
  }

  toString() {
    return this.fullyQualifiedType;
  }

  /**
   * Given the name of a type as it appears in an API builder schema, returns
   * whether it is a representation of a map type.
   * @example
   * FullyQualifiedType.isMapType("map[string]");
   * //=> true
   * FullyQualifiedType.isMapType("string");
   * //=> false
   * @param {String} type
   * @returns {Boolean}
   */
  static isMapType(type) {
    return objectOfRegex.test(type);
  }

  /**
   * Given the name of a type as it appears in an API builder schema, returns
   * whether it is a representation of an array type.
   * @example
   * FullyQualifiedType.isArrayType("[string]");
   * //=> true
   * FullyQualifiedType.isArrayType("string");
   * //=> false
   * @param {String} type
   * @returns {Boolean}
   */
  static isArrayType(type) {
    return arrayOfRegex.test(type);
  }

  /**
   * Produces an AST given the name of a type as it appears in an API builder
   * schema. Useful to construct concrete types from strings.
   * @example
   * FullyQualifiedType.astFromType("string")
   * // => { name: "string" }
   * FullyQualifiedType.astFromType("map[[string]]");
   * //=> { name: "map", type: { name: "array", type: { name: "string" } } }
   * @param {String} type
   * @return {Object}
   */
  static astFromType(type) {
    switch (true) {
      case FullyQualifiedType.isMapType(type):
        return {
          name: TypeKind.MAP,
          type: FullyQualifiedType.astFromType(FullyQualifiedType.getNestedType(type)),
        };
      case FullyQualifiedType.isArrayType(type):
        return {
          name: TypeKind.ARRAY,
          type: FullyQualifiedType.astFromType(FullyQualifiedType.getNestedType(type)),
        };
      default:
        return { name: type };
    }
  }

  /**
   * Given an API builder AST, returns the corresponding string type
   * representation from that AST.
   * @example
   * FullyQualifiedType.typeFromAst({ name: "map", type: { name: "string" } });
   * //=> "map[string]"
   * @param {Object} ast
   * @returns {String}
   */
  static typeFromAst(ast) {
    switch (ast.name) {
      case TypeKind.MAP:
        return `map[${FullyQualifiedType.typeFromAst(ast.type)}]`;
      case TypeKind.ARRAY:
        return `[${FullyQualifiedType.typeFromAst(ast.type)}]`;
      default:
        return ast.name;
    }
  }

  /**
   * API Builder types can be complex (e.g. array of strings, map of strings,
   * maps of array of strings etc.). By design, all values in an array or map
   * must be of the same type: this is called the base type. A base type may or
   * may not be a fully qualified name unless it is a primitive type.
   * @example
   * FullyQualifiedType.getBaseType("map[string]")
   * //=> "string"
   * FullyQualifiedType.getBaseType("map[[string]]")
   * //=> "string"
   * @param {String} type
   * @returns {String}
   */
  static getBaseType(type) {
    if (typeof type === 'string') {
      const ast = FullyQualifiedType.astFromType(type);
      return FullyQualifiedType.getBaseType(ast);
    } else if (type.type != null) {
      return FullyQualifiedType.getBaseType(type.type);
    }

    return type.name;
  }

  /**
   * Given the name of a type as it appears in an API builder schema, returns
   * the name of the type wrapped in a map or array type.
   * @example
   * FullyQualifiedType.getNestedType("map[string]");
   * //=> "string"
   * FullyQualifiedType.getNestedType("map[[string]]");
   * //=> "[string]"
   * @param {String} type
   * @returns {String}
   */
  static getNestedType(type) {
    if (FullyQualifiedType.isMapType(type)) {
      const [, $1] = type.match(objectOfRegex);
      return $1;
    } else if (FullyQualifiedType.isArrayType(type)) {
      const [, $1] = type.match(arrayOfRegex);
      return $1;
    }

    return type;
  }


  /**
   * Given the name of a type as it appears in an API builder schema, returns
   * whether its base type represents a primitive type.
   * @example
   * FullyQualifiedType.isPrimitiveType("string");
   * //=> true
   * FullyQualifiedType.isPrimitiveType("map[date_time_iso8601]");
   * // => true
   * FullyQualifiedType.isPrimitiveType("[com.bryzek.spec.v0.models.reference]");
   * // => false
   * @param {String} type
   * @returns {Boolean}
   */
  static isPrimitiveType(type) {
    return includes([
      TypeKind.BOOLEAN,
      TypeKind.DATE_ISO8601,
      TypeKind.DATE_TIME_ISO8601,
      TypeKind.DECIMAL,
      TypeKind.DOUBLE,
      TypeKind.INTEGER,
      TypeKind.JSON,
      TypeKind.LONG,
      TypeKind.OBJECT,
      TypeKind.STRING,
      TypeKind.UNIT,
      TypeKind.UUID,
    ], FullyQualifiedType.getBaseType(type));
  }
}


module.exports = FullyQualifiedType;
