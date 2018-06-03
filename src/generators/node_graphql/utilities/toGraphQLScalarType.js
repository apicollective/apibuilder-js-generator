const { Kind } = require('../../../utilities/apibuilder');

/**
 * Calculates the GraphQL scalar type for writing into generated code. May
 * return `undefined` when type is not a type that can be represented with
 * native GraphQL scalar types.
 * @param {ApiBuilderType} type
 * @returns {String}
 */
function toGraphQLScalarType(type) {
  switch (type.baseType) {
    case Kind.STRING:
    case Kind.DATE_ISO8601:
    case Kind.DATE_TIME_ISO8601:
    case Kind.JSON:
      return 'GraphQLString';
    case Kind.UUID:
      return 'GraphQLID';
    case Kind.BOOLEAN:
      return 'GraphQLBoolean';
    case Kind.INTEGER:
      return 'GraphQLInt';
    case Kind.DECIMAL:
    case Kind.DOUBLE:
    case Kind.LONG:
      return 'GraphQLFloat';
    case Kind.OBJECT:
      return 'GraphQLString';
    case Kind.UNIT:
      return 'GraphQLUnit';
    default:
      return undefined;
  }
}

module.exports = toGraphQLScalarType;
