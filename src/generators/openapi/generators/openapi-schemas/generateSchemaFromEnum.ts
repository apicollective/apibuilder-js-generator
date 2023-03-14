import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderEnum } from 'apibuilder-js';
import { map } from 'lodash';

function generateSchemaFromEnum(enm: ApiBuilderEnum): SchemaObject {
  const enumValues = map(enm.values, (value) => value.name);

  let description: string;
  if (enm.description && enm.description.endsWith('.')) {
    description = `${enm.description} `;
  } else if (enm.description) {
    description = `${enm.description}. `;
  } else {
    description = '';
  }

  return {
    [enm.name]: {
      description: `${description}Possible values: ${String(enumValues)}.`,
      ...enm.isDeprecated && { deprecated: enm.isDeprecated },
      enum: enumValues,
      type: 'string',
    },
  };
}

export default generateSchemaFromEnum;
