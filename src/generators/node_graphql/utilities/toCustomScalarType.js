const { Kind } = require('../../../utilities/apibuilder');

/**
 * Calculates the GraphQL scalar type for writing into generated code. May
 * return `undefined` when type is not a type that can be represented with
 * native GraphQL scalar types.
 * @param {ApiBuilderType} type
 * @returns {String}
 */
function toCustomScalarType(type) {
  switch (type.baseType) {
    case Kind.DATE_ISO8601:
      return 'GraphQLDate';
    case Kind.DATE_TIME_ISO8601:
      return 'GraphQLDateTime';
    case Kind.JSON:
      return 'ApiBuilderJson';
    case Kind.OBJECT:
      return 'ApiBuilderObject';
    case Kind.UNIT:
      return 'ApiBuilderUnit';
    case Kind.LONG:
      return 'ApiBuilderLong';
    default:
      return undefined;
  }
}

module.exports = toCustomScalarType;
