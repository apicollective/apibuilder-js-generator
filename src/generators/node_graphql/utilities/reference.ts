import {
  ApiBuilderService,
  ApiBuilderType,
  astFromTypeName,
  isEnclosingType,
  isType,
  typeFromAst,
} from '../../../utilities/apibuilder';

import invariant = require('invariant');

/**
 * Check whether a type is a reference to another type
 */
export function isReference(type: ApiBuilderType) {
  invariant(isType(type), 'isReference takes an ApiBuilderType');

  if (isEnclosingType(type)) {
    return isReference(type.ofType);
  }

  return type.shortName.match(/^(.+)_reference$/);
}

/**
 * Given an XyzReference, get the type Xyz
 */
export function getFullType(type: ApiBuilderType, service: ApiBuilderService) {
  const match = isReference(type);
  invariant(match, 'getFullType() only works on reference types');
  try {
    return typeFromAst(astFromTypeName(match[1]), service);
  } catch (e) {
    return null; // type not found
  }
}

export function expandReference(type: ApiBuilderType, service: ApiBuilderService) {
  if (isReference(type)) {
    const full = getFullType(type, service);
    // TODO: union types and containers?
    if (full !== null /*&& !isUnionType(full) && !isEnclosingType(full)*/) {
      return full;
    }
  }
}
