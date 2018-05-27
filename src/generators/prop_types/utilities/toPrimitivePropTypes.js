/**
 * Calculates the primitive prop type validator for writing into generated code.
 * @param {ApiBuilderType} type
 * @param {Boolean} [required = false]
 */
function toPrimitivePropTypes(type) {
  switch (type.baseType) {
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

module.exports = toPrimitivePropTypes;
