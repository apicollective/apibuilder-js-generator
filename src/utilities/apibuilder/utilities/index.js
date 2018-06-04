const {
  astFromTypeName,
  typeFromAst,
  typeNameFromAst,
  mapType
} = require('./ast');

const {
  FullyQualifiedType,
  Kind,
  getBaseTypeName,
  getNestedTypeName,
  isArrayTypeName,
  isMapTypeName,
  isPrimitiveTypeName,
} = require('./schema');

exports.FullyQualifiedType = FullyQualifiedType;
exports.Kind = Kind;
exports.astFromTypeName = astFromTypeName;
exports.getBaseTypeName = getBaseTypeName;
exports.getNestedTypeName = getNestedTypeName;
exports.isArrayTypeName = isArrayTypeName;
exports.isMapTypeName = isMapTypeName;
exports.isPrimitiveTypeName = isPrimitiveTypeName;
exports.mapType = mapType;
exports.typeFromAst = typeFromAst;
exports.typeNameFromAst = typeNameFromAst;
