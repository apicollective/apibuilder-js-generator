const { Kind } = require('../../../utilities/apibuilder');

/**
 * Calculates the primitive prop type validator for writing into generated code.
 * @param {ApiBuilderPrimitiveType} type
 * @param {Boolean} [required = false]
 */
function toPrimitivePropTypes(type) {
  // TODO: Use invariant to check type is valid primitive type.
  switch (type.baseType) {
    case Kind.STRING:
    case Kind.DATE_ISO8601:
    case Kind.DATE_TIME_ISO8601:
    case Kind.UUID:
      return 'PropTypes.string';
    case Kind.BOOLEAN:
      return 'PropTypes.bool';
    case Kind.DECIMAL:
    case Kind.DOUBLE:
    case Kind.INTEGER:
    case Kind.LONG:
      return 'PropTypes.number';
    case Kind.OBJECT:
      return 'PropTypes.object';
    default:
      return 'PropTypes.any';
  }
}

module.exports = toPrimitivePropTypes;
