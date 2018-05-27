const invariant = require('invariant');
const find = require('lodash/find');
const matchesProperty = require('lodash/matchesProperty');
const overSome = require('lodash/overSome');
const some = require('lodash/some');

const FullyQualifiedType = require('./FullyQualifiedType');

/**
 * Base class for all API Builder type classes.
 */
class Entity {
  /**
   * Create an entity.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {Service} service
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

    Object.defineProperty(this, 'nestedEntity', {
      get() {
        return this.isEnclosingType
          ? Entity.fromType(fullyQualifiedType.nestedType, service)
          : null;
      },
    });

    Object.defineProperty(this, 'isEnclosingType', {
      enumerable: true,
      value: fullyQualifiedType.isEnclosingType,
    });

    Object.defineProperty(this, 'isPrimitive', {
      enumerable: true,
      value: fullyQualifiedType.isPrimitive,
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
   * Returns whether the specified entity is in the same package as this entity.
   * @param {Entity} entity
   * @returns {Boolean}
   */
  isInSamePackage(entity) {
    return this.packageName === entity.packageName;
  }
}

function isEntity(entity, type, service) {
  const baseType = FullyQualifiedType.getBaseType(type);
  return some(service[entity], overSome([
    matchesProperty('shortName', baseType),
    matchesProperty('baseType', baseType),
  ]));
}

function findEntityByType(entity, type, service) {
  const baseType = FullyQualifiedType.getBaseType(type);
  return find(service[entity], overSome([
    matchesProperty('shortName', baseType),
    matchesProperty('baseType', baseType),
  ]));
}

function isModel(type, service) {
  return isEntity('models', type, service);
}

function isEnum(type, service) {
  return isEntity('enums', type, service);
}

function isUnion(type, service) {
  return isEntity('unions', type, service);
}

function findModelByType(type, service) {
  return findEntityByType('models', type, service);
}

function findEnumByType(type, service) {
  return findEntityByType('enums', type, service);
}

function findUnionByType(type, service) {
  return findEntityByType('unions', type, service);
}

/**
 * Recursively expand a type to its fully qualified type tree representation.
 * If necessary, use FullyQualifiedType.formatType to turn back returned value
 * into a string representation of the type in question.
 * @param {String|Object} type
 * @param {Service} service
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
 * Returns the Entity corresponding to the specified type. When resolving
 * non-primitive types, internal types will take precedence over external types.
 * That being said, using a type short name to resolve to the correct entity is
 * unreliable. For best results, use a fully qualified type.
 * @param {String} type
 * @param {Service} service
 * @returns {Entity}
 */
Entity.fromType = function fromType(type, service) {
  let fullyQualifiedType = toFullyQualifiedType(type, service);
  fullyQualifiedType = FullyQualifiedType.formatType(fullyQualifiedType);
  fullyQualifiedType = new FullyQualifiedType(fullyQualifiedType);
  return new Entity(fullyQualifiedType, service);
};

module.exports = Entity;
