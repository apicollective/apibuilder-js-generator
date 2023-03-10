import { ResponsesObject } from '@loopback/openapi-v3-types';
import { ApiBuilderResponse } from 'apibuilder-js';
import { reduce } from 'lodash';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';
import { generateResponseObject } from '.';

function generateResponsesObject(
  apibuilderOperationResponses: ApiBuilderResponse[],
  typeValidator,
  isImported: IsImportedChecker,
): ResponsesObject {
  const responses = reduce(
    apibuilderOperationResponses,
    (acc, value) => {
      const { code } = value;
      const { isDefault } = value;
      const key = (isDefault) ? 'default' : code;
      acc[key] = generateResponseObject(value, typeValidator, isImported);

      return acc;
    },
    {},
  );

  return responses;
}

export default generateResponsesObject;
