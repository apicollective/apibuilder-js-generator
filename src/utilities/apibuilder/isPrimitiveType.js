const ApiBuilderPrimitiveType = require('./ApiBuilderPrimitiveType');

function isPrimitiveType(type) {
  return type instanceof ApiBuilderPrimitiveType;
}

module.exports = isPrimitiveType;
