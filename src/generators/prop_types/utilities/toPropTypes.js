const toDefaultExport = require('./toDefaultExport');
const toPrimitivePropTypes = require('./toPrimitivePropTypes');

const {
  isArrayType,
  isEnumType,
  isPrimitiveType,
  isMapType,
  isModelType,
  isUnionType,
} = require('../../../utilities/apibuilder');

/**
 * Calculates the prop type validator for writing to generated code.
 * @param {ApiBuilderType} type - The type in question.
 * @param {Boolean} [required = false]
 */
function toPropTypes(type, required = false) {
  // TODO: Use invariant to check type is valid.

  let propType;

  if (isMapType(type)) {
    propType = `PropTypes.objectOf(${toPropTypes(type.ofType)})`;
  } else if (isArrayType(type)) {
    propType = `PropTypes.arrayOf(${toPropTypes(type.ofType)})`;
  } else if (isPrimitiveType(type)) {
    propType = toPrimitivePropTypes(type);
  } else if (isModelType(type)) {
    propType = toDefaultExport(type);
  } else if (isUnionType(type)) {
    propType = toDefaultExport(type);
  } else if (isEnumType(type)) {
    propType = toDefaultExport(type);
  }

  if (required) {
    propType = `${propType}.isRequired`;
  }

  return propType;
}

module.exports = toPropTypes;
