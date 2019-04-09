import { ApiBuilderArray } from 'apibuilder-js';
import { convertApiBuilderType } from '../openapi-utils';

function convertApiBuilderArray(array: ApiBuilderArray, validate) {
  const type = array.ofType;
  return {
    items: convertApiBuilderType(type, validate),
    type: 'array',
  };
}

export default convertApiBuilderArray;
