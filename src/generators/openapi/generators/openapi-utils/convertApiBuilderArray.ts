import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderArray } from 'apibuilder-js';
import { IsImportedChecker } from './isTypeImported';
import { convertApiBuilderType } from '.';

function convertApiBuilderArray(
  array: ApiBuilderArray,
  validate,
  isImported: IsImportedChecker,
): SchemaObject {
  const type = array.ofType;
  return {
    items: convertApiBuilderType(type, validate, isImported),
    type: 'array',
  };
}

export default convertApiBuilderArray;
