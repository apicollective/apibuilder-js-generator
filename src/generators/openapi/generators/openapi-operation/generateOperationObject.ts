import { OperationObject, ParameterObject, RequestBodyObject } from '@loopback/openapi-v3-types';
import {
  ApiBuilderBody,
  ApiBuilderOperation,
  ApiBuilderParameter,
  ApiBuilderService,
} from 'apibuilder-js';
import {
  map,
} from 'lodash';
import { generateParameterObject } from '../openapi-parameter';
import { generateRequestBodyObject } from '../openapi-request-body';
import { generateResponsesObject } from '../openapi-responses';
import { isTypeImported } from '../openapi-utils';

function generateOperationObject(
  apibuilderOperation: ApiBuilderOperation,
  service: ApiBuilderService,
  typeValidator,
): OperationObject {
  const mangleOperationPath = (path: string): string => path.replace(/[^a-zA-Z/_]/g, '').split('/').filter(Boolean).join('-');

  const generateOperationId = (path: string, method: string): string => {
    const pathKey = mangleOperationPath(path);
    const operationId = `${method.toLowerCase()}--${pathKey}`;
    return operationId;
  };

  // eslint-disable-next-line max-len
  const generateParameterObjectWithValidation = (parameter: ApiBuilderParameter): ParameterObject => generateParameterObject(parameter, typeValidator, isTypeImported(service));

  const generateRequestBodyObjectWithValidation = (body: ApiBuilderBody)
  : RequestBodyObject => generateRequestBodyObject(body, typeValidator, isTypeImported(service));

  return {
    ...apibuilderOperation.description && { description: apibuilderOperation.description },
    operationId: generateOperationId(apibuilderOperation.path, apibuilderOperation.method),
    parameters: map(apibuilderOperation.parameters, generateParameterObjectWithValidation),
    ...apibuilderOperation.body && {
      requestBody: generateRequestBodyObjectWithValidation(apibuilderOperation.body),
    },
    responses: generateResponsesObject(
      apibuilderOperation.responses,
      typeValidator,
      isTypeImported(service),
    ),
    tags: [apibuilderOperation.resource.typeName],
  };
}

export default generateOperationObject;
