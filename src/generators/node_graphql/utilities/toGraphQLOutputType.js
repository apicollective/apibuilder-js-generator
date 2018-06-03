const invariant = require('invariant');

const isMapType = require('../../../utilities/apibuilder/isMapType');
const isArrayType = require('../../../utilities/apibuilder/isArrayType');
const isPrimitiveType = require('../../../utilities/apibuilder/isPrimitiveType');
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

  if (isMapType(type)) {
    // TODO: Add support for GraphQLOutputType from ApiBuilderMap
    // invariant(false, `Cannot convert ${String(type)} to GraphQLOutputType because it is not supported.`);
    outputType = `new GraphQLString()`;
  } else if (isArrayType(type)) {
    outputType = `new GraphQLList(${toGraphQLOutputType(type.ofType)})`;
  } else if (isPrimitiveType(type)) {
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
