const toDefaultExport = require('./toDefaultExport');
const toPrimitivePropTypes = require('./toPrimitivePropTypes');

/**
 * Calculates the prop type validator for writing to generated code.
 * @param {Entity} entity - The entity in question.
 * @param {Boolean} [required = false]
 */
function toPropTypes(entity, required = false) {
  let propType;

  if (entity.isMapType) {
    propType = `PropTypes.objectOf(${toPropTypes(entity.nestedEntity)})`;
  } else if (entity.isArrayType) {
    propType = `PropTypes.arrayOf(${toPropTypes(entity.nestedEntity)})`;
  } else if (entity.isPrimitive) {
    propType = toPrimitivePropTypes(entity);
  } else if (entity.isModel) {
    propType = `PropTypes.shape(${toDefaultExport(entity)})`;
  } else if (entity.isUnion) {
    propType = `PropTypes.oneOfType(${toDefaultExport(entity)})`;
  } else if (entity.isEnum) {
    propType = `PropTypes.oneOf(${toDefaultExport(entity)})`;
  }

  if (required) {
    propType = `${propType}.isRequired`;
  }

  return propType;
}

module.exports = toPropTypes;
