import { SchemaObject } from '@loopback/openapi-v3-types';
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
import { IsImportedChecker } from './isTypeImported';

function convertApiBuilderType(
  type: ApiBuilderType,
  validate,
  isImported: IsImportedChecker,
): SchemaObject {
  if (type instanceof ApiBuilderPrimitiveType) {
    return convertApiBuilderPrimitiveType(type);
  }

  if (type instanceof ApiBuilderArray) {
    return convertApiBuilderArray(type, validate, isImported);
  }

  if (
    type instanceof ApiBuilderModel ||
    type instanceof ApiBuilderEnum ||
    type instanceof ApiBuilderUnion) {

    if (isImported(type)) {
      return {}; // any type
    }

    if (validate(type)) {
      return convertApiBuilderTypeToReference(type);
    }

    throw new Error(`Apibuilder type ${type} not found`);
  }
}

export default convertApiBuilderType;
