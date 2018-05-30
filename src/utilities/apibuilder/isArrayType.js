const ApiBuilderArray = require('./ApiBuilderArray');

function isArrayType(type) {
  return type instanceof ApiBuilderArray;
}

module.exports = isArrayType;
