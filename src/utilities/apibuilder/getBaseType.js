const isEnclosingType = require('./isEnclosingType');

/**
 * If a given type is a collection, this recursively strips the collection
 * wrappers and returns the underlying type.
 * @param {ApiBuilderType} type
 * @returns {ApiBuilderType}
 */
function getBaseType(type) {
  if (isEnclosingType(type)) return getBaseType(type.ofType);
  return type;
}

module.exports = getBaseType;
