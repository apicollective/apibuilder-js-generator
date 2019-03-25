import { OperationObject } from '@loopback/openapi-v3-types';
import {
  ApiBuilderBody,
  ApiBuilderOperation,
  ApiBuilderService,
} from 'apibuilder-js';
import debug from 'debug';
import {
  map,
} from 'lodash';
import { generateParameterObject } from '../openapi-parameter';
import { generateRequestBodyObject } from '../openapi-request-body';
import { generateResponsesObject } from '../openapi-responses';

function generateOperationObject(
  apibuilderOperation: ApiBuilderOperation,
  service: ApiBuilderService,
  typeValidator,
): OperationObject {
  const generateParameterObjectWithValidation = (parameter) => {
    return generateParameterObject(parameter, typeValidator);
  };

  const generateRequestBodyObjectWithValidation = (body) => {
    const requestBody = new ApiBuilderBody(body, service);
    return generateRequestBodyObject(requestBody, typeValidator);
  };

  return {
    description: apibuilderOperation.description,
    parameters: map(apibuilderOperation.parameters, generateParameterObjectWithValidation),
    ...apibuilderOperation.body && {
      requestBody: generateRequestBodyObjectWithValidation(apibuilderOperation.body),
    },
    responses: generateResponsesObject(apibuilderOperation.responses),
  };
}

export default generateOperationObject;
