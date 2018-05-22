const toDefaultExport = require('./toDefaultExport');
const toPrimitivePropTypes = require('./toPrimitivePropTypes');

/**
 * Calculates the prop type validator for writing to generated code.
 * @param {Entity} entity - The entity in question.
 * @param {Boolean} [required = false]
 */
function toPropTypes(entity, required = false) {
  let validator;

  if (entity.isModel) {
    validator = `PropTypes.shape(${toDefaultExport(entity)})`;
  } else if (entity.isUnion) {
    validator = `PropTypes.oneOfType(${toDefaultExport(entity)})`;
  } else if (entity.isEnum) {
    validator = `PropTypes.oneOf(${toDefaultExport(entity)})`;
  } else {
    validator = toPrimitivePropTypes(entity);
  }

  if (entity.isArray) {
    validator = `PropTypes.arrayOf(${validator})`;
  }

  if (entity.isMap) {
    validator = `PropTypes.objectOf(${validator})`;
  }

  if (required) {
    validator = `${validator}.isRequired`;
  }

  return validator;
}

module.exports = toPropTypes;
