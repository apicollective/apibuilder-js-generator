const ApiBuilderUnion = require('./ApiBuilderUnion');

function isUnionType(type) {
  return type instanceof ApiBuilderUnion;
}

module.exports = isUnionType;
