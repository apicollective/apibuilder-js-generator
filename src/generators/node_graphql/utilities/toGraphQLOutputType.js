const invariant = require('invariant');

const toDefaultExport = require('./toDefaultExport');
const toGraphQLScalarType = require('./toGraphQLScalarType');

/**
 * Calculates the GraphQL output type for writing into generated code.
 * @param {ApiBuilderType} type
 * @param {Boolean} [required = false]
 * @returns {String}
 */
function toGraphQLOutputType(type, required = false) {
  let outputType;

  if (type.isMapType) {
    invariant(false, '???');
  } else if (type.isArrayType) {
    outputType = `new GraphQLList(${toGraphQLOutputType(type.nestedType)})`;
  } else if (type.isPrimitiveType) {
    outputType = toGraphQLScalarType(type);
  } else {
    outputType = toDefaultExport(type);
  }

  invariant(outputType != null, `${outputType} must be a valid GraphQLOutputType`);

  if (required) {
    outputType = `new GraphQLNonNull(${outputType})`;
  }

  return outputType;
}


module.exports = toGraphQLOutputType;
