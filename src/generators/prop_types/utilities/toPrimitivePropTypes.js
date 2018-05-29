const TypeKind = require('../../../utilities/apibuilder/TypeKind');

/**
 * Calculates the primitive prop type validator for writing into generated code.
 * @param {ApiBuilderPrimitiveType} type
 * @param {Boolean} [required = false]
 */
function toPrimitivePropTypes(type) {
  // TODO: Use invariant to check type is valid primitive type.
  switch (type.baseType) {
    case TypeKind.STRING:
    case TypeKind.DATE_ISO8601:
    case TypeKind.DATE_TIME_ISO8601:
    case TypeKind.UUID:
      return 'PropTypes.string';
    case TypeKind.BOOLEAN:
      return 'PropTypes.bool';
    case TypeKind.DECIMAL:
    case TypeKind.DOUBLE:
    case TypeKind.INTEGER:
    case TypeKind.LONG:
      return 'PropTypes.number';
    case TypeKind.OBJECT:
      return 'PropTypes.object';
    default:
      return 'PropTypes.any';
  }
}

module.exports = toPrimitivePropTypes;
