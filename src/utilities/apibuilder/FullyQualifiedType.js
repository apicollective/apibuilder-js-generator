const includes = require('lodash/includes');
const invariant = require('invariant');
const values = require('lodash/values');

const PrimitiveType = require('./PrimitiveType');

const EMPTY_STRING = '';

const arrayOfRegex = /^\[(.+)\]$/;

const objectOfRegex = /^map\[(.+)\]$/;

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
     * This property holds the nested type.
     *
     * A nested type is a type defined within the scope of another type, which
     * is called the enclosing type. Only array or map types can enclose
     * another type, which may be any of the supported API builder types,
     * including another array or map.
     *
     * May be null if this type is not an array or map type.
     *
     * @property {String}
     */
    Object.defineProperty(this, 'nestedType', {
      get() {
        if (!this.isEnclosingType) {
          return null;
        }

        const enclosingType = FullyQualifiedType.parseType(this.fullyQualifiedType);
        const nestedType = FullyQualifiedType.formatType(enclosingType.type);
        return nestedType;
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
     * This property holds whether this type is an enclosing type.
     *
     * An enclosing type is a type that encloses another type, which is called
     * the nested type. Only array or map types can enclose another type, which
     * may be one of the supported API builder types, including another array or map.
     *
     * @property {Boolean}
     */
    Object.defineProperty(this, 'isEnclosingType', {
      get() {
        return this.isArray || this.isMap;
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

function parseType(type) {
  switch (true) {
    case isMap(type):
      return {
        name: 'map',
        type: parseType(type.match(objectOfRegex)[1]),
      };
    case isArray(type):
      return {
        name: 'array',
        type: parseType(type.match(arrayOfRegex)[1]),
      };
    default:
      return { name: type };
  }
}

function formatType(object) {
  switch (object.name) {
    case 'map':
      return `map[${formatType(object.type)}]`;
    case 'array':
      return `[${formatType(object.type)}]`;
    default:
      return object.name;
  }
}

/**
 * API Builder types can be complex (e.g. array of strings, map of strings,
 * maps of array of strings etc.). By design, all values in an array or map
 * must be of the same type: this is called the base type. A base type may or
 * may not be a fully qualified name unless it is a primitive type.
 */
function toBaseType(type) {
  if (typeof type === 'string') {
    return toBaseType(parseType(type));
  } else if (type.type != null) {
    return toBaseType(type.type);
  }

  return type.name;
}


/**
 * Returns whether the specified type is a primitive type.
 * @param {String} type
 * @returns {Boolean}
 */
function isPrimitiveType(type) {
  return includes(values(PrimitiveType), toBaseType(type));
}

function mapType(type, fun) {
  const t = parseType(type);
  let inner = t;
  while (typeof inner.type !== 'undefined') {
    inner = inner.type;
  }
  inner.name = fun(inner.name);
  return formatType(t);
}


FullyQualifiedType.formatType = formatType;
FullyQualifiedType.isArray = isArray;
FullyQualifiedType.isMap = isMap;
FullyQualifiedType.isPrimitiveType = isPrimitiveType;
FullyQualifiedType.parseType = parseType;
FullyQualifiedType.toBaseType = toBaseType;
FullyQualifiedType.mapType = mapType;

module.exports = FullyQualifiedType;
