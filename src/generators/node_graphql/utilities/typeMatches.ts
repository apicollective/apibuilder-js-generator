import { ApiBuilderBaseType, ApiBuilderType } from '../../../utilities/apibuilder';

/**
 * Returns whether the type matches str, str_v2, str_v*...
 */
export default function typeMatches(type: ApiBuilderBaseType, str: ApiBuilderType) {
  const versioned = new RegExp(`^${str.toString()}(?:_v\\d+)?$`);
  return type.fullyQualifiedType.fullyQualifiedType.match(versioned);
}
