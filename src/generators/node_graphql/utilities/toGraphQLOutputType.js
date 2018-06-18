const invariant = require('invariant');

const { isArrayType, isMapType, isPrimitiveType } = require('../../../utilities/apibuilder');
const toDefaultExport = require('./toDefaultExport');
const toGraphQLScalarType = require('./toGraphQLScalarType');
const toCustomScalarType = require('./toCustomScalarType');

/**
 * Calculates the GraphQL output type for writing into generated code.
 * @param {ApiBuilderType} type
 * @param {Boolean} [required = false]
 * @returns {String}
 */
function toGraphQLOutputType(type, required = false) {
  let outputType;

  if (isMapType(type)) {
    outputType = `new GraphQLList(makeMapEntry(${toGraphQLOutputType(type.ofType)}))`;
  } else if (isArrayType(type)) {
    outputType = `new GraphQLList(${toGraphQLOutputType(type.ofType)})`;
  } else if (isPrimitiveType(type)) {
    outputType = toGraphQLScalarType(type) || toCustomScalarType(type);
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
