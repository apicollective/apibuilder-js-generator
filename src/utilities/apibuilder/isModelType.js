const ApiBuilderModel = require('./ApiBuilderModel');

function isModelType(type) {
  return type instanceof ApiBuilderModel;
}

module.exports = isModelType;
