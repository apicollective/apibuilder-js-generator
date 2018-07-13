const invariant = require('invariant');

const { isArrayType, isMapType, isPrimitiveType } = require('../../../utilities/apibuilder');
const { expandReference } = require('./reference');
const toDefaultExport = require('./toDefaultExport');
const toGraphQLScalarType = require('./toGraphQLScalarType');
const toCustomScalarType = require('./toCustomScalarType');

/**
 * Calculates the GraphQL output type for writing into generated code.
 * @param {ApiBuilderType} type
 * @param {Boolean} [required = false]
 * @returns {String}
 */
function toGraphQLOutputType(type, required = false, service) {
  let outputType;

  if (isMapType(type)) {
    outputType = `new GraphQLList(new GraphQLNonNull(makeMapEntry(${toGraphQLOutputType(type.ofType, false, service)})))`;
  } else if (isArrayType(type)) {
    outputType = `new GraphQLList(new GraphQLNonNull(${toGraphQLOutputType(type.ofType, false, service)}))`;
  } else if (isPrimitiveType(type)) {
    outputType = toGraphQLScalarType(type) || toCustomScalarType(type);
  } else {
    const finalType = expandReference(type, service) || type;
    outputType = toDefaultExport(finalType);
  }

  invariant(outputType != null, `${outputType} must be a valid GraphQLOutputType`);

  if (required) {
    outputType = `new GraphQLNonNull(${outputType})`;
  }

  return outputType;
}


module.exports = toGraphQLOutputType;
