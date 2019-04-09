import { ResponseObject } from '@loopback/openapi-v3-types';
import { ApiBuilderResponse } from 'apibuilder-js';
import { generateHeadersObject } from '../openapi-header';

function generateResponseObject(response: ApiBuilderResponse): ResponseObject {
  const {
    description,
    headers,
    type,
  } = response;

  return {
    description: String(description || type),
    headers: generateHeadersObject(headers),
  };
}

export default generateResponseObject;
