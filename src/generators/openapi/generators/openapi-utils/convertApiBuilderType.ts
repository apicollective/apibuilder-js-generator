import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
} from 'apibuilder-js';
import {
  convertApiBuilderArray,
  convertApiBuilderPrimitiveType,
  convertApiBuilderTypeToReference,
} from '../openapi-utils';

function convertApiBuilderType(type: ApiBuilderType, validate) {
  if (type instanceof ApiBuilderPrimitiveType) {
    return convertApiBuilderPrimitiveType(type);
  }

  if (type instanceof ApiBuilderArray) {
    return convertApiBuilderArray(type, validate);
  }

  if (
    type instanceof ApiBuilderModel ||
    type instanceof ApiBuilderEnum ||
    type instanceof ApiBuilderUnion) {
    if (validate(type)) {
      return convertApiBuilderTypeToReference(type);
    }

    throw new Error(`Apibuilder type ${type} not found`);
  }
}

export default convertApiBuilderType;
