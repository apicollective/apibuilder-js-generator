import { RequestBodyObject } from '@loopback/openapi-v3-types';
import { ApiBuilderBody } from 'apibuilder-js';
import { convertApiBuilderType } from '../openapi-utils';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateRequestBodyObject(
  apibuilderBody: ApiBuilderBody,
  validator,
  isImported: IsImportedChecker,
): RequestBodyObject {
  const {
    type,
  } = apibuilderBody;

  return {
    content: {
      'application/json': {
        schema: convertApiBuilderType(type, validator, isImported),
      },
    },
  };
}

export default generateRequestBodyObject;
