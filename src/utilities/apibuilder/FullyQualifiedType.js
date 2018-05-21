const invariant = require('invariant');

const EMPTY_STRING = '';

const primitiveTypes = [
  'boolean',
  'date-iso8601',
  'date-time-iso8601',
  'decimal',
  'double',
  'integer',
  'json',
  'long',
  'object',
  'string',
  'unit',
  'uuid',
];

const arrayOfRegex = /^\[([^\]]+)\]$/;

const objectOfRegex = /^map\(([^)]+)\)$/;

class FullyQualifiedType {
  /**
   * Create a fully qualified type.
   * @param {String} fullyQualifiedType
   * @example
   * new FullyQualifiedType("string");
   * new FullyQualifiedType("[string]");
   * new FullyQualifiedType("map(string)");
   * new FullyQualifiedType("com.bryzek.apidoc.common.v0.models.reference");
   * new FullyQualifiedType("[com.bryzek.apidoc.common.v0.models.reference]");
   * new FullyQualifiedType("map(com.bryzek.apidoc.common.v0.models.reference)");
   */
  constructor(fullyQualifiedType) {
    invariant(
      FullyQualifiedType.toBaseType(fullyQualifiedType).lastIndexOf('.') >= 0 ||
      FullyQualifiedType.isPrimitiveType(fullyQualifiedType),
      `"${fullyQualifiedType}" is not fully qualified type or primitive type. ` +
      'A fully qualified type consists of a package name followed by the ' +
      'base short name. (e.g. "com.bryzek.apidoc.common.v0.models.reference").',
    );

    Object.defineProperty(this, 'fullyQualifiedType', {
      enumerable: true,
      value: fullyQualifiedType,
    });

    /**
     * This property holds the fully qualified base type name.
     * @property {String}
     */
    Object.defineProperty(this, 'fullyQualifiedName', {
      get() {
        return FullyQualifiedType.toBaseType(this.fullyQualifiedType);
      },
    });

    /**
     * This property holds the base short name.
     * @property {String}
     */
    Object.defineProperty(this, 'shortName', {
      get() {
        const lastIndex = this.fullyQualifiedName.lastIndexOf('.');
        return lastIndex === -1 ?
          this.fullyQualifiedName :
          this.fullyQualifiedName.substring(lastIndex + 1);
      },
    });

    /**
     * This property holds the package name.
     * @property {String}
     */
    Object.defineProperty(this, 'packageName', {
      get() {
        const lastIndex = this.fullyQualifiedName.lastIndexOf('.');
        return (this.isPrimitive || lastIndex === -1)
          ? EMPTY_STRING
          : this.fullyQualifiedName.substring(0, lastIndex);
      },
    });

    /**
     * This property holds whether this is an array.
     * @property {Boolean}
     */
    Object.defineProperty(this, 'isArray', {
      get() {
        return FullyQualifiedType.isArray(this.fullyQualifiedType);
      },
    });

    /**
     * This property holds whether this is a map.
     * @property {Boolean}
     */
    Object.defineProperty(this, 'isMap', {
      get() {
        return FullyQualifiedType.isMap(this.fullyQualifiedType);
      },
    });

    /**
     * This property holds whether this is a primitive type.
     * @property {Boolean}
     */
    Object.defineProperty(this, 'isPrimitive', {
      get() {
        return FullyQualifiedType.isPrimitiveType(this.fullyQualifiedType);
      },
    });
  }
}

/**
 * API Builder types can be complex (e.g. array of strings, map of strings, etc.)
 * By design, all values in an array or map must be of the same type:
 * this is called the base type. A base type may or may not be a fully
 * qualified name unless it is a primitive type.
 */
function toBaseType(type) {
  let baseType = type;

  if (objectOfRegex.test(baseType)) {
    const [, $1] = baseType.match(objectOfRegex);
    baseType = $1;
  } else if (arrayOfRegex.test(baseType)) {
    const [, $1] = baseType.match(arrayOfRegex);
    baseType = $1;
  }

  return baseType;
}

/**
 * Returns whether the specified type is a map.
 * @param {String} type
 * @returns {Boolean}
 */
function isMap(type) {
  return objectOfRegex.test(type);
}

/**
 * Returns whether the specified type is an array.
 * @param {String} type
 * @returns {Boolean}
 */
function isArray(type) {
  return arrayOfRegex.test(type);
}

/**
 * Returns whether the specified type is a primitive type.
 * @param {String} type
 * @returns {Boolean}
 */
function isPrimitiveType(type) {
  return primitiveTypes.includes(toBaseType(type));
}

FullyQualifiedType.isArray = isArray;
FullyQualifiedType.isMap = isMap;
FullyQualifiedType.isPrimitiveType = isPrimitiveType;
FullyQualifiedType.toBaseType = toBaseType;

module.exports = FullyQualifiedType;
