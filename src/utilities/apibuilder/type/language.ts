const definition = require('./definition');

/**
 * Returns whether the specified object is an API Builder enumeration type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isEnumType(type) {
  const { ApiBuilderEnum } = definition;
  return type instanceof ApiBuilderEnum;
}

/**
 * Returns whether the specified object is an API Builder array type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isArrayType(type) {
  const { ApiBuilderArray } = definition;
  return type instanceof ApiBuilderArray;
}

/**
 * Returns whether the specified object is an API Builder map type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isMapType(type) {
  const { ApiBuilderMap } = definition;
  return type instanceof ApiBuilderMap;
}

/**
 * Returns whether the specified object is an API Builder model type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isModelType(type) {
  const { ApiBuilderModel } = definition;
  return type instanceof ApiBuilderModel;
}

/**
 * Returns whether the specified object is an API Builder primitive type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isPrimitiveType(type) {
  const { ApiBuilderPrimitiveType } = definition;
  return type instanceof ApiBuilderPrimitiveType;
}

/**
 * Returns whether the specified object is an API Builder union type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isUnionType(type) {
  const { ApiBuilderUnion } = definition;
  return type instanceof ApiBuilderUnion;
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder enclosing types.
 * @param {?ApiBuilderType} type
 * @returns {Boolen}
 */
export function isEnclosingType(type) {
  return (
    isArrayType(type) ||
    isMapType(type)
  );
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder types.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isType(type) {
  return (
    isArrayType(type) ||
    isMapType(type) ||
    isPrimitiveType(type) ||
    isModelType(type) ||
    isEnumType(type) ||
    isUnionType(type)
  );
}

/**
 * If a given type is an enclosing type, this recursively strips the enclosing
 * wrappers and returns the underlying type.
 * @param {?ApiBuilderType} type
 * @returns {?ApiBuilderType}
 */
export function getBaseType(type) {
  if (isEnclosingType(type)) {
    return getBaseType(type.ofType);
  }

  return type;
}
