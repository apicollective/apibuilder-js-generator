const toDefaultExport = require('./toDefaultExport');
const toPrimitivePropTypes = require('./toPrimitivePropTypes');

/**
 * Calculates the prop type validator for writing to generated code.
 * @param {ApiBuilderType} type - The type in question.
 * @param {Boolean} [required = false]
 */
function toPropTypes(type, required = false) {
  let propType;

  if (type.isMapType) {
    propType = `PropTypes.objectOf(${toPropTypes(type.nestedType)})`;
  } else if (type.isArrayType) {
    propType = `PropTypes.arrayOf(${toPropTypes(type.nestedType)})`;
  } else if (type.isPrimitiveType) {
    propType = toPrimitivePropTypes(type);
  } else if (type.isModel) {
    propType = `PropTypes.shape(${toDefaultExport(type)})`;
  } else if (type.isUnion) {
    propType = `PropTypes.oneOfType(${toDefaultExport(type)})`;
  } else if (type.isEnum) {
    propType = `PropTypes.oneOf(${toDefaultExport(type)})`;
  }

  if (required) {
    propType = `${propType}.isRequired`;
  }

  return propType;
}

module.exports = toPropTypes;
