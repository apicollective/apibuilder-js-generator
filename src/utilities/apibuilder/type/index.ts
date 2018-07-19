export * from './array';
export * from './enum';
export * from './enumValue';
export * from './field';
export * from './generator';
export * from './import';
export * from './language';
export * from './map';
export * from './model';
export * from './operation';
export * from './operationArgument';
export * from './primitiveType';
export * from './resource';
export * from './service';
export * from './union';
export * from './unionType';

import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderUnion,
} from '.';

export type ApiBuilderEnclosingType = ApiBuilderArray | ApiBuilderMap;
export type ApiBuilderBaseType = ApiBuilderPrimitiveType
                               | ApiBuilderEnum
                               | ApiBuilderModel
                               | ApiBuilderUnion;
export type ApiBuilderType = ApiBuilderEnclosingType | ApiBuilderBaseType;
