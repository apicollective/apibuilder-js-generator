const { isType, typeFromAst, astFromTypeName } = require('../../../utilities/apibuilder');
const invariant = require('invariant');

function isReference(type) {
  invariant(isType(type), 'isReference takes an ApiBuilderType');
  return type.shortName.match(/^(.+)_reference$/);
};

exports.isReference = isReference;

/**
 * @param {ApiBuilderType} type 
 * @param {ApiBuilderService} service 
 */
function getFullType(type, service) {
  const match = isReference(type);
  invariant(match, "getFullType() only works on reference types");
  try {
    return typeFromAst(astFromTypeName(match[1]), service);
  } catch (e) {
    return null; // type not found
  }
};

exports.getFullType = getFullType;