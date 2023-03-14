import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import { map } from 'lodash';
import { isTypeImported, typeValidator } from '../openapi-utils';
import generateSchemaFromModel from './generateSchemaFromModel';

function generateSchemaModels(service: ApiBuilderService): SchemaObject[] {
  const validator = typeValidator(service);
  const isImported = isTypeImported(service);
  return map(service.models, (model) => generateSchemaFromModel(model, validator, isImported));
}

export default generateSchemaModels;
