import { ApiBuilderField } from 'apibuilder-js';
import { reduce } from 'lodash';
import { convertApiBuilderType } from '../openapi-utils';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateSchemaPropertiesFromModelFields(
  fields: ApiBuilderField[],
  validate,
  isImported: IsImportedChecker,
) {
  return reduce(
    fields,
    (acc, value) => {
      acc[value.name] = convertApiBuilderType(value.type, validate, isImported);
      return acc;
    },
    {},
  );
}

export default generateSchemaPropertiesFromModelFields;
