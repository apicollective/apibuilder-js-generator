const {
  isEnclosingType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} = require('../../../utilities/apibuilder');

function isCyclic(sourceType, targetType, checkedTypes = []) {
  // condition to avoid infinite loop
  if (checkedTypes.includes(targetType)) {
    return false;
  // primitive types do not introduce cyclic dependencies issues
  } else if (isPrimitiveType(sourceType) || isPrimitiveType(targetType)) {
    return false;
  // self references
  } else if (sourceType === targetType) {
    return true;
  } else if (isModelType(targetType)) {
    return targetType.fields.some(field =>
      isCyclic(sourceType, field.type, checkedTypes.concat(targetType)));
  } else if (isUnionType(targetType)) {
    return targetType.types.some(unionType =>
      isCyclic(sourceType, unionType.type, checkedTypes.concat(targetType)));
  } else if (isEnclosingType(targetType)) {
    return isCyclic(sourceType, targetType.ofType, checkedTypes.concat(targetType));
  }

  return false;
}

module.exports = isCyclic;
