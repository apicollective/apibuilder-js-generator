const definition = require('./definition');

/**
 * Returns whether the specified object is an API Builder enumeration type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isEnumType(type) {
  const { ApiBuilderEnum } = definition;
  return type instanceof ApiBuilderEnum;
}

exports.isEnumType = isEnumType;

/**
 * Returns whether the specified object is an API Builder array type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isArrayType(type) {
  const { ApiBuilderArray } = definition;
  return type instanceof ApiBuilderArray;
}

exports.isArrayType = isArrayType;

/**
 * Returns whether the specified object is an API Builder map type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isMapType(type) {
  const { ApiBuilderMap } = definition;
  return type instanceof ApiBuilderMap;
}

exports.isMapType = isMapType;

/**
 * Returns whether the specified object is an API Builder model type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isModelType(type) {
  const { ApiBuilderModel } = definition;
  return type instanceof ApiBuilderModel;
}

exports.isModelType = isModelType;

/**
 * Returns whether the specified object is an API Builder primitive type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isPrimitiveType(type) {
  const { ApiBuilderPrimitiveType } = definition;
  return type instanceof ApiBuilderPrimitiveType;
}

exports.isPrimitiveType = isPrimitiveType;

/**
 * Returns whether the specified object is an API Builder union type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isUnionType(type) {
  const { ApiBuilderUnion } = definition;
  return type instanceof ApiBuilderUnion;
}

exports.isUnionType = isUnionType;

/**
 * Returns whether the specified object is one of the possible
 * API Builder enclosing types.
 * @param {?ApiBuilderType} type
 * @returns {Boolen}
 */
function isEnclosingType(type) {
  return (
    isArrayType(type) ||
    isMapType(type)
  );
}

exports.isEnclosingType = isEnclosingType;

/**
 * Returns whether the specified object is one of the possible
 * API Builder types.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
function isType(type) {
  return (
    isArrayType(type) ||
    isMapType(type) ||
    isPrimitiveType(type) ||
    isModelType(type) ||
    isEnumType(type) ||
    isUnionType(type)
  );
}

exports.isType = isType;

/**
 * If a given type is an enclosing type, this recursively strips the enclosing
 * wrappers and returns the underlying type.
 * @param {?ApiBuilderType} type
 * @returns {?ApiBuilderType}
 */
function getBaseType(type) {
  if (isEnclosingType(type)) {
    return getBaseType(type.ofType);
  }

  return type;
}

exports.getBaseType = getBaseType;
