import { ParameterObject } from '@loopback/openapi-v3-types';
import {
  ApiBuilderParameter,
} from 'apibuilder-js';
import { get } from 'lodash';
import {
  convertApiBuilderType,
  convertLocationToIn,
} from '../openapi-utils';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateParameterObject(
  apibuilderParameter: ApiBuilderParameter,
  parameterTypeValidator,
  isImported: IsImportedChecker,
): ParameterObject {
  const {
    defaultValue,
    description: apibuilderDescription,
    deprecation: apibuilderDeprecation,
    isRequired,
    name,
    location,
    type,
  } = apibuilderParameter;

  const parameterConversionWarning = 'Apibuilder defined this parameter location as "Form" which is incompatible with the OpenAPI spec.';

  const description = (location === 'Form')
    ? apibuilderDescription + parameterConversionWarning : apibuilderDescription;

  const parameterObj = {
    deprecated: Boolean(get(apibuilderDeprecation, 'description')),
    example: defaultValue || undefined,
    in: convertLocationToIn(location),
    required: isRequired,
    schema: convertApiBuilderType(type, parameterTypeValidator, isImported),
    ...description && { description },
    name,
  };

  return parameterObj;
}

export default generateParameterObject;
