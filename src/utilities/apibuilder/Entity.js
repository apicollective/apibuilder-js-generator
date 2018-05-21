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
      value: fullyQualifiedType,
    });

    Object.defineProperty(this, 'fullyQualifiedName', {
      value: fullyQualifiedType.fullyQualifiedName,
      enumerable: true,
    });

    Object.defineProperty(this, 'shortName', {
      value: fullyQualifiedType.shortName,
      enumerable: true,
    });

    Object.defineProperty(this, 'packageName', {
      value: fullyQualifiedType.packageName,
      enumerable: true,
    });

    Object.defineProperty(this, 'isPrimitive', {
      value: fullyQualifiedType.isPrimitive,
      enumerable: true,
    });

    Object.defineProperty(this, 'isMap', {
      value: fullyQualifiedType.isMap,
      enumerable: true,
    });

    Object.defineProperty(this, 'isArray', {
      value: fullyQualifiedType.isArray,
      enumerable: true,
    });

    Object.defineProperty(this, 'isUnion', {
      get() {
        return some(service.unions, {
          fullyQualifiedName: this.fullyQualifiedName,
        });
      },
    });

    Object.defineProperty(this, 'isEnum', {
      get() {
        return some(service.enums, {
          fullyQualifiedName: this.fullyQualifiedName,
        });
      },
    });

    Object.defineProperty(this, 'isModel', {
      get() {
        return some(service.models, {
          fullyQualifiedName: this.fullyQualifiedName,
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
  const baseType = FullyQualifiedType.toBaseType(type);
  return some(service[entity], overSome([
    matchesProperty('shortName', baseType),
    matchesProperty('fullyQualifiedName', baseType),
  ]));
}

function findEntityByType(entity, type, service) {
  const baseType = FullyQualifiedType.toBaseType(type);
  return find(service[entity], overSome([
    matchesProperty('shortName', baseType),
    matchesProperty('fullyQualifiedName', baseType),
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
 * Returns the Entity corresponding to the specified type. When resolving
 * non-primitive types, internal types will take precedence over external types.
 * That being said, using a type short name to resolve to the correct entity is
 * unreliable. For best results, use a fully qualified type.
 * @param {String} type
 * @param {Service} service
 * @returns {Entity}
 */
Entity.fromType = function fromType(type, service) {
  const baseType = FullyQualifiedType.toBaseType(type);

  let fullyQualifiedType;

  if (FullyQualifiedType.isPrimitiveType(baseType)) {
    fullyQualifiedType = baseType;
  } else if (isModel(baseType, service)) {
    fullyQualifiedType = findModelByType(baseType, service).fullyQualifiedName;
  } else if (isUnion(baseType, service)) {
    fullyQualifiedType = findUnionByType(baseType, service).fullyQualifiedName;
  } else if (isEnum(baseType, service)) {
    fullyQualifiedType = findEnumByType(baseType, service).fullyQualifiedName;
  } else {
    invariant(false, `"${type}" is not a type available in "${service.applicationKey}@${service.version}" service`);
  }

  if (FullyQualifiedType.isMap(type)) {
    fullyQualifiedType = `map(${fullyQualifiedType})`;
  } else if (FullyQualifiedType.isArray(type)) {
    fullyQualifiedType = `[${fullyQualifiedType}]`;
  }

  fullyQualifiedType = new FullyQualifiedType(fullyQualifiedType);

  return new Entity(fullyQualifiedType, service);
};

module.exports = Entity;
