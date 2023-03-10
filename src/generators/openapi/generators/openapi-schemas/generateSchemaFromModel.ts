import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderModel } from 'apibuilder-js';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';
import {
  generateSchemaPropertiesFromModelFields,
} from '.';

function generateSchemaFromModel(
  model: ApiBuilderModel,
  modelValidator,
  isImported: IsImportedChecker,
): SchemaObject {
  const required = model.fields.filter((f) => f.isRequired).map((req) => req.name);
  const properties = generateSchemaPropertiesFromModelFields(
    model.fields,
    modelValidator,
    isImported,
  );

  return {
    [model.shortName]: {
      ...model.description && { description: model.description },
      ...model.fields.length && { properties },
      ...required.length && { required },
      ...model.isDeprecated && { deprecated: model.isDeprecated },
      ...model.fields.length && { type: 'object' },
    },
  };
}

export default generateSchemaFromModel;
