import { ApiBuilderEnum } from 'apibuilder-js';
import { map } from 'lodash';

function generateSchemaFromEnum(enm: ApiBuilderEnum) {
  const enumValues = map(enm.values, value => value.name);

  let description: string
  if (enm.description && enm.description.endsWith('.'))
    description = `${enm.description} `
  else if (enm.description)
    description = `${enm.description}. `
  else
    description = ''

  return {
    [enm.name]: {
      description: `${description}Possible values: ${enumValues}.`,
      ...enm.isDeprecated && { deprecated: enm.isDeprecated },
      enum: enumValues,
      type: 'string',
    },
  };
}

export default generateSchemaFromEnum;
