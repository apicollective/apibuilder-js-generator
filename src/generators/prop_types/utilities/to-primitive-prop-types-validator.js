const getRootType = require('../../../utilities/apibuilder/utilities/get-root-type');

function toPrimitivePropTypesValidator(type) {
  switch (getRootType(type)) {
    case 'string':
    case 'date-iso8601':
    case 'date-time-iso8601':
    case 'uuid':
      return 'PropTypes.string';
    case 'boolean':
      return 'PropTypes.bool';
    case 'decimal':
    case 'double':
    case 'integer':
    case 'long':
      return 'PropTypes.number';
    case 'object':
      return 'PropTypes.object';
    default:
      return 'PropTypes.any';
  }
}

module.exports = toPrimitivePropTypesValidator;
