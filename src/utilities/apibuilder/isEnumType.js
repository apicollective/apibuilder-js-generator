const ApiBuilderEnum = require('./ApiBuilderEnum');

function isEnumType(type) {
  return type instanceof ApiBuilderEnum;
}

module.exports = isEnumType;
