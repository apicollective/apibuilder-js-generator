import { ResponseObject } from '@loopback/openapi-v3-types';
import { ApiBuilderResponse } from 'apibuilder-js';
import { generateHeadersObject } from '../openapi-header';
import { convertApiBuilderType } from '../openapi-utils';
import { type IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateResponseObject(
  response: ApiBuilderResponse,
  validator,
  isImported: IsImportedChecker,
): ResponseObject {
  const {
    description,
    headers,
    type,
  } = response;

  return {
    ...(description || type) && { description: String(description || type) },
    content: {
      'application/json': {
        schema: convertApiBuilderType(type, validator, isImported),
      },
    },
    headers: generateHeadersObject(headers),
  };
}

export default generateResponseObject;
