import type {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderUnion,
} from 'apibuilder-js';

export type ApiBuilderEnclosingType = ApiBuilderArray | ApiBuilderMap;
export type ApiBuilderBaseType = ApiBuilderPrimitiveType
| ApiBuilderEnum
| ApiBuilderModel
| ApiBuilderUnion;
