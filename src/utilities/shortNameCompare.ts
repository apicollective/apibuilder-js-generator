import { ApiBuilderEnum, ApiBuilderModel, ApiBuilderUnion } from 'apibuilder-js';
import stringCompare from './stringCompare';

export default function shortNameCompare(
  type1: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  type2: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): number {
  return stringCompare(type1.shortName, type2.shortName);
}
