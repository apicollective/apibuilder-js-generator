const TypeKind = require('../../../utilities/apibuilder/TypeKind');

/**
 * Calculates the GraphQL scalar type for writing into generated code. May
 * return `undefined` when type is not a type that can be represented with
 * native GraphQL scalar types.
 * @param {ApiBuilderType} type
 * @returns {String}
 */
function toGraphQLScalarType(type) {
  switch (type.baseType) {
    case TypeKind.STRING:
    case TypeKind.DATE_ISO8601:
    case TypeKind.DATE_TIME_ISO8601:
    case TypeKind.JSON:
      return 'GraphQLString';
    case TypeKind.UUID:
      return 'GraphQLID';
    case TypeKind.BOOLEAN:
      return 'GraphQLBoolean';
    case TypeKind.INTEGER:
      return 'GraphQLInt';
    case TypeKind.DECIMAL:
    case TypeKind.DOUBLE:
    case TypeKind.LONG:
      return 'GraphQLFloat';
    case TypeKind.OBJECT:
    case TypeKind.UNIT:
    default:
      return undefined;
  }
}

module.exports = toGraphQLScalarType;
