const invariant = require('invariant');

const toDefaultExport = require('./toDefaultExport');
const toGraphQLScalarType = require('./toGraphQLScalarType');

/**
 * Calculates the GraphQL output type for writing into generated code.
 * @param {Entity} entity
 * @param {Boolean} [required = false]
 * @returns {String}
 */
function toGraphQLOutputType(entity, required = false) {
  let outputType;

  if (entity.isMapType) {
    invariant(false, '???');
  } else if (entity.isArrayType) {
    outputType = `new GraphQLList(${toGraphQLOutputType(entity.nestedEntity)})`;
  } else if (entity.isPrimitive) {
    outputType = toGraphQLScalarType(entity);
  } else {
    outputType = toDefaultExport(entity);
  }

  invariant(outputType != null, `${outputType} must be a valid GraphQLOutputType`);

  if (required) {
    outputType = `new GraphQLNonNull(${outputType})`;
  }

  return outputType;
}


module.exports = toGraphQLOutputType;
