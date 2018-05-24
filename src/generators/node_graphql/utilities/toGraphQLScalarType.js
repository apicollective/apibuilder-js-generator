/**
 * Calculates the GraphQL scalar type for writing into generated code. May
 * return `undefined` when entity is not a type that can be represented with
 * native GraphQL scalar types.
 * @param {Entity} entity
 * @returns {String}
 */
function toGraphQLScalarType(entity) {
  switch (entity.fullyQualifiedName) {
    case 'string':
    case 'date-iso8601':
    case 'date-time-iso8601':
    case 'json':
      return 'GraphQLString';
    case 'uuid':
      return 'GraphQLID';
    case 'boolean':
      return 'GraphQLBoolean';
    case 'integer':
      return 'GraphQLInt';
    case 'decimal':
    case 'double':
    case 'long':
      return 'GraphQLFloat';
    case 'object':
    case 'unit':
    default:
      return undefined;
  }
}

module.exports = toGraphQLScalarType;
