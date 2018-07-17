import { ApiBuilderType, ApiBuilderBaseType, ApiBuilderEnclosingType, ApiBuilderPrimitiveType, ApiBuilderUnion, ApiBuilderModel, ApiBuilderMap, ApiBuilderArray, ApiBuilderEnum } from "./definition";

const definition = require('./definition');

/**
 * Returns whether the specified object is an API Builder enumeration type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isEnumType(type): type is ApiBuilderEnum {
  return type instanceof ApiBuilderEnum;
}

/**
 * Returns whether the specified object is an API Builder array type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isArrayType(type): type is ApiBuilderArray {
  return type instanceof ApiBuilderArray;
}

/**
 * Returns whether the specified object is an API Builder map type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isMapType(type): type is ApiBuilderMap {
  return type instanceof ApiBuilderMap;
}

/**
 * Returns whether the specified object is an API Builder model type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isModelType(type): type is ApiBuilderModel {
  return type instanceof ApiBuilderModel;
}

/**
 * Returns whether the specified object is an API Builder primitive type.
 * @returns {Boolean}
 */
export function isPrimitiveType(type): type is ApiBuilderPrimitiveType {
  return type instanceof ApiBuilderPrimitiveType;
}

/**
 * Returns whether the specified object is an API Builder union type.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isUnionType(type): type is ApiBuilderUnion {
  return type instanceof ApiBuilderUnion;
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder enclosing types.
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isEnclosingType(type): type is ApiBuilderEnclosingType {
  return (
    isArrayType(type) ||
    isMapType(type)
  );
}

/**
 * Returns whether the specified object is one of the possible
 * API Builder types.
 * TODO: remove? this is redundant with TypeScript
 * @param {?ApiBuilderType} type
 * @returns {Boolean}
 */
export function isType(type: ApiBuilderType) {
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
 */
export function getBaseType(type: ApiBuilderType): ApiBuilderBaseType {
  if (isEnclosingType(type)) {
    return getBaseType(type.ofType);
  }

  return type;
}
