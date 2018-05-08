const isEntityOfType = require('./is-entity-of-type');
const toDefaultExport = require('./to-default-export');
const toPrimitivePropTypesValidator = require('./to-primitive-prop-types-validator');
const isArray = require('../../../utilities/apibuilder/utilities/is-array');
const isMap = require('../../../utilities/apibuilder/utilities/is-map');

function toPropTypesValidator(type, entities, required = false) {
  let validator;

  if (isEntityOfType(type, 'model', entities)) {
    validator = `PropTypes.shape(${toDefaultExport(type)})`;
  } else if (isEntityOfType(type, 'union', entities)) {
    validator = `PropTypes.oneOfType(${toDefaultExport(type)})`;
  } else if (isEntityOfType(type, 'enum', entities)) {
    validator = `PropTypes.oneOf(${toDefaultExport(type)})`;
  } else {
    validator = toPrimitivePropTypesValidator(type);
  }

  if (isArray(type)) {
    validator = `PropTypes.arrayOf(${validator})`;
  }

  if (isMap(type)) {
    validator = `PropTypes.objectOf(${validator})`;
  }

  if (required) {
    validator = `${validator}.isRequired`;
  }

  return validator;
}

module.exports = toPropTypesValidator;
