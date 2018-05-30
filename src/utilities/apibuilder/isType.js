const isArrayType = require('./isArrayType');
const isEnumType = require('./isEnumType');
const isMapType = require('./isMapType');
const isModelType = require('./isModelType');
const isPrimitiveType = require('./isPrimitiveType');
const isUnionType = require('./isUnionType');

/**
 * Returns whether argument is one of the possible API Builder types.
 * @param {*} type
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

module.exports = isType;
