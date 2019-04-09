import { ResponsesObject } from '@loopback/openapi-v3-types';
import { ApiBuilderResponse } from 'apibuilder-js';
import { reduce } from 'lodash';
import { generateResponseObject } from '../openapi-responses';

function generateResponsesObject(
  apibuilderOperationResponses,
): ResponsesObject {
  const responses = reduce(
    apibuilderOperationResponses,
    (acc, value) => {
      const response = new ApiBuilderResponse(value.config, value.service);
      const code = response.code;
      const isDefault = response.isDefault;
      const key = (isDefault) ? 'default' : code;
      acc[key] = generateResponseObject(response);

      return acc;
    },
    {},
  );

  return responses;
}

export default generateResponsesObject;
