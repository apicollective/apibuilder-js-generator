import { ApiBuilderModel } from 'apibuilder-js';
import {
  generateSchemaPropertiesFromModelFields,
} from '../openapi-schemas';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateSchemaFromModel(
  model: ApiBuilderModel,
  modelValidator,
  isImported: IsImportedChecker,
) {
  const required = model.fields.filter(f => f.isRequired).map(req => req.name);
  const properties = generateSchemaPropertiesFromModelFields(model.fields,
                                                             modelValidator,
                                                             isImported);

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
