const PrimitiveType = require('../../../utilities/apibuilder/PrimitiveType');

/**
 * Calculates the GraphQL scalar type for writing into generated code. May
 * return `undefined` when type is not a type that can be represented with
 * native GraphQL scalar types.
 * @param {ApiBuilderType} type
 * @returns {String}
 */
function toGraphQLScalarType(type) {
  switch (type.baseType) {
    case PrimitiveType.STRING:
    case PrimitiveType.DATE_ISO8601:
    case PrimitiveType.DATE_TIME_ISO8601:
    case PrimitiveType.JSON:
      return 'GraphQLString';
    case PrimitiveType.UUID:
      return 'GraphQLID';
    case PrimitiveType.BOOLEAN:
      return 'GraphQLBoolean';
    case PrimitiveType.INTEGER:
      return 'GraphQLInt';
    case PrimitiveType.DECIMAL:
    case PrimitiveType.DOUBLE:
    case PrimitiveType.LONG:
      return 'GraphQLFloat';
    case PrimitiveType.OBJECT:
    case PrimitiveType.UNIT:
    default:
      return undefined;
  }
}

module.exports = toGraphQLScalarType;
