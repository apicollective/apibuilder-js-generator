const invariant = require('invariant');
const find = require('lodash/find');
const matchesProperty = require('lodash/matchesProperty');
const overSome = require('lodash/overSome');
const some = require('lodash/some');

const FullyQualifiedType = require('./FullyQualifiedType');

/**
 * Base class for all API Builder type classes.
 */
class ApiBuilderType {
  /**
   * Create an ApiBuilderType.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
   */
  constructor(fullyQualifiedType, service) {
    Object.defineProperty(this, 'fullyQualifiedType', {
      enumerable: true,
      value: fullyQualifiedType.fullyQualifiedType,
    });

    Object.defineProperty(this, 'baseType', {
      enumerable: true,
      value: fullyQualifiedType.baseType,
    });

    Object.defineProperty(this, 'shortName', {
      enumerable: true,
      value: fullyQualifiedType.shortName,
    });

    Object.defineProperty(this, 'packageName', {
      enumerable: true,
      value: fullyQualifiedType.packageName,
    });

    Object.defineProperty(this, 'nestedType', {
      get() {
        return this.isEnclosingType
          ? ApiBuilderType.fromType(fullyQualifiedType.nestedType, service)
          : null;
      },
    });

    Object.defineProperty(this, 'isEnclosingType', {
      enumerable: true,
      value: fullyQualifiedType.isEnclosingType,
    });

    Object.defineProperty(this, 'isPrimitiveType', {
      enumerable: true,
      value: fullyQualifiedType.isPrimitiveType,
    });

    Object.defineProperty(this, 'isMapType', {
      enumerable: true,
      value: fullyQualifiedType.isMapType,
    });

    Object.defineProperty(this, 'isArrayType', {
      enumerable: true,
      value: fullyQualifiedType.isArrayType,
    });

    Object.defineProperty(this, 'isUnion', {
      get() {
        return some(service.unions, {
          baseType: this.baseType,
        });
      },
    });

    Object.defineProperty(this, 'isEnum', {
      get() {
        return some(service.enums, {
          baseType: this.baseType,
        });
      },
    });

    Object.defineProperty(this, 'isModel', {
      get() {
        return some(service.models, {
          baseType: this.baseType,
        });
      },
    });
  }

  /**
   * Returns whether the specified type is in the same package as this type.
   * @param {ApiBuilderType} type
   * @returns {Boolean}
   */
  isInSamePackage(type) {
    return this.packageName === type.packageName;
  }
}

function isTypeIn(name, type, service) {
  const baseType = FullyQualifiedType.getBaseType(type);
  return some(service[name], overSome([
    matchesProperty('shortName', baseType),
    matchesProperty('baseType', baseType),
  ]));
}

function findTypeIn(name, type, service) {
  const baseType = FullyQualifiedType.getBaseType(type);
  return find(service[name], overSome([
    matchesProperty('shortName', baseType),
    matchesProperty('baseType', baseType),
  ]));
}

function isModel(type, service) {
  return isTypeIn('models', type, service);
}

function isEnum(type, service) {
  return isTypeIn('enums', type, service);
}

function isUnion(type, service) {
  return isTypeIn('unions', type, service);
}

function findModelByType(type, service) {
  return findTypeIn('models', type, service);
}

function findEnumByType(type, service) {
  return findTypeIn('enums', type, service);
}

function findUnionByType(type, service) {
  return findTypeIn('unions', type, service);
}

/**
 * Recursively expand a type to its fully qualified type tree representation.
 * If necessary, use FullyQualifiedType.formatType to turn back returned value
 * into a string representation of the type in question.
 * @param {String|Object} type
 * @param {ApiBuilderService} service
 * @returns {Object}
 */
function toFullyQualifiedType(type, service) {
  if (typeof type === 'string') {
    return toFullyQualifiedType(FullyQualifiedType.parseType(type), service);
  } else if (type.name === 'map') {
    return { name: 'map', type: toFullyQualifiedType(type.type, service) };
  } else if (type.name === 'array') {
    return { name: 'array', type: toFullyQualifiedType(type.type, service) };
  } else if (FullyQualifiedType.isPrimitiveType(type.name)) {
    return { name: type.name };
  } else if (isModel(type.name, service)) {
    return { name: findModelByType(type.name, service).baseType };
  } else if (isUnion(type.name, service)) {
    return { name: findUnionByType(type.name, service).baseType };
  } else if (isEnum(type.name, service)) {
    return { name: findEnumByType(type.name, service).baseType };
  }

  return invariant(false, `"${type}" is not a type available in "${service.applicationKey}@${service.version}" service`);
}

/**
 * Returns the ApiBuilderType corresponding to the specified type.
 * When resolving non-primitive types, internal types will take precedence over
 * external types. That being said, using a short name to resolve to the
 * correct type is unreliable. For best results, use a fully qualified type.
 * @param {String} type
 * @param {ApiBuilderService} service
 * @returns {ApiBuilderType}
 */
ApiBuilderType.fromType = function fromType(type, service) {
  let fullyQualifiedType = toFullyQualifiedType(type, service);
  fullyQualifiedType = FullyQualifiedType.formatType(fullyQualifiedType);
  fullyQualifiedType = new FullyQualifiedType(fullyQualifiedType);
  return new ApiBuilderType(fullyQualifiedType, service);
};

module.exports = ApiBuilderType;
