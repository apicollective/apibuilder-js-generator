import { RequestBodyObject } from '@loopback/openapi-v3-types';
import { ApiBuilderBody } from 'apibuilder-js';
import { convertApiBuilderType } from '../openapi-utils';

function generateRequestBodyObject(apibuilderBody: ApiBuilderBody, validator): RequestBodyObject {
  const {
    type,
  } = apibuilderBody;

  return {
    content: {
      'application/json': {
        schema: convertApiBuilderType(type, validator),
      },
    },
  };
}

export default generateRequestBodyObject;
