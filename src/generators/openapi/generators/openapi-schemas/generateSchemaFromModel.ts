import { ApiBuilderModel } from 'apibuilder-js';
import {
  filter,
  map,
} from 'lodash';
import {
  generateSchemaPropertiesFromModelFields,
} from '../openapi-schemas';

function generateSchemaFromModel(model: ApiBuilderModel, modelValidator) {
  const required = map(filter(model.fields, ['required', true]), req => req.name);
  const properties = generateSchemaPropertiesFromModelFields(model.fields, modelValidator);

  return {
    [model.shortName]: {
      description: model.description,
      ...model.fields.length && { properties },
      ...required.length && { required },
      ...model.isDeprecated && { deprecated: model.isDeprecated },
      ...model.fields.length && { type: 'object' },
    },
  };
}

export default generateSchemaFromModel;
