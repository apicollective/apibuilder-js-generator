import type { ApiBuilderEnum, ApiBuilderModel, ApiBuilderUnion } from 'apibuilder-js';
import isArrayOfString from './isArrayOfStrings';

type Tags = string[];

export default function getTags(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion
): Tags {
  return type.attributes.reduce<Tags>((tags, attribute) => {
    if (attribute.name === 'tags' && isArrayOfString(attribute.value))
      tags.push(...attribute.value);
    return tags;
  }, []);
}
