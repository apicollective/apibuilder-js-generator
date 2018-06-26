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
      return 'GraphQLString';
    case Kind.UUID:
      return 'GraphQLID';
    case Kind.BOOLEAN:
      return 'GraphQLBoolean';
    case Kind.INTEGER:
      return 'GraphQLInt';
    case Kind.DECIMAL:
    case Kind.DOUBLE:
      return 'GraphQLFloat';
    default:
      return undefined;
  }
}

module.exports = toGraphQLScalarType;
