import { SchemaObject } from '@loopback/openapi-v3-types';
import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
} from 'apibuilder-js';
import { IsImportedChecker } from './isTypeImported';
import {
  convertApiBuilderArray,
  convertApiBuilderPrimitiveType,
  convertApiBuilderTypeToReference,
} from '.';

function convertApiBuilderType(
  type: ApiBuilderType,
  validate,
  isImported: IsImportedChecker,
): SchemaObject | undefined {
  if (type instanceof ApiBuilderPrimitiveType) {
    return convertApiBuilderPrimitiveType(type);
  }

  if (type instanceof ApiBuilderArray) {
    return convertApiBuilderArray(type, validate, isImported);
  }

  if (
    type instanceof ApiBuilderModel
    || type instanceof ApiBuilderEnum
    || type instanceof ApiBuilderUnion) {
    if (isImported(type)) {
      return {}; // any type
    }

    if (validate(type)) {
      return convertApiBuilderTypeToReference(type);
    }
    throw new Error(`Apibuilder type ${String(type)} not found`);
  }
  return undefined;
}

export default convertApiBuilderType;
