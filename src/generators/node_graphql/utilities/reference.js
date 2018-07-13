const { isType, isEnclosingType, isUnionType, isEnumType, typeFromAst, astFromTypeName } = require('../../../utilities/apibuilder');
const invariant = require('invariant');

/**
 * Check whether a type is a reference to another type
 * @param {ApiBuilderType} type
 */
function isReference(type) {
  invariant(isType(type), 'isReference takes an ApiBuilderType');

  if (isEnclosingType(type)) {
    return isReference(type.ofType);
  }

  return type.shortName.match(/^(.+)_reference$/);
}

exports.isReference = isReference;

/**
 * Given an XyzReference, get the type Xyz
 * @param {ApiBuilderType} type
 * @param {ApiBuilderService} service
 */
function getFullType(type, service) {
  const match = isReference(type);
  invariant(match, 'getFullType() only works on reference types');
  try {
    return typeFromAst(astFromTypeName(match[1]), service);
  } catch (e) {
    return null; // type not found
  }
}

exports.getFullType = getFullType;

/**
 * @param {ApiBuilderType} type
 * @param {ApiBuilderService} service
 */
function expandReference(type, service) {
  if (isReference(type)) {
    const full = getFullType(type, service);
    // TODO: union types and containers?
    if (full !== null /*&& !isUnionType(full) && !isEnclosingType(full)*/)
      return full;
  }
}

exports.expandReference = expandReference;
