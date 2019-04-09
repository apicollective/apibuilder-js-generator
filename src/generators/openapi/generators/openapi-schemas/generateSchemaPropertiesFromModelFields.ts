import { ApiBuilderField } from 'apibuilder-js';
import { reduce } from 'lodash';
import { convertApiBuilderType } from '../openapi-utils';

function generateSchemaPropertiesFromModelFields(fields: ApiBuilderField[], validate) {
  return reduce(
    fields,
    (acc, value) => {
      acc[value.name] = convertApiBuilderType(value.type, validate);
      return acc;
    },
    {},
  );
}

export default generateSchemaPropertiesFromModelFields;
