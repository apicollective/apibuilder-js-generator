const ApiBuilderMap = require('./ApiBuilderMap');

function isMapType(type) {
  return type instanceof ApiBuilderMap;
}

module.exports = isMapType;
