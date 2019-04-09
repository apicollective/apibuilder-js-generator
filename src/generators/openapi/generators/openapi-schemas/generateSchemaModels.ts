import { map } from 'lodash';
import { typeValidator } from '../openapi-utils';
import generateSchemaFromModel from './generateSchemaFromModel';

function generateSchemaModels(service) {
  const validator = typeValidator(service);
  return map(service.models, model => generateSchemaFromModel(model, validator));
}

export default generateSchemaModels;
