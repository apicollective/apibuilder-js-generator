import { map } from 'lodash';
import { isTypeImported, typeValidator } from '../openapi-utils';
import generateSchemaFromModel from './generateSchemaFromModel';

function generateSchemaModels(service) {
  const validator = typeValidator(service);
  const isImported = isTypeImported(service);
  return map(service.models, model => generateSchemaFromModel(model, validator, isImported));
}

export default generateSchemaModels;
