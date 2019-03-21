import { OperationObject } from '@loopback/openapi-v3-types';
import { ApiBuilderOperation } from 'apibuilder-js';
import {
  map,
} from 'lodash';
import { generateParameterObject } from '../openapi-parameter';
import { generateResponsesObject } from '../openapi-responses';

function generateOperationObject(
  apibuilderOperation: ApiBuilderOperation,
  parameterTypeValidator,
): OperationObject {
  const generateParameterObjectWithValidation = (parameter) => {
    return generateParameterObject(parameter, parameterTypeValidator);
  };

  return {
    description: apibuilderOperation.description,
    parameters: map(apibuilderOperation.parameters, generateParameterObjectWithValidation),
    responses: generateResponsesObject(apibuilderOperation.responses),
  };
}

export default generateOperationObject;
