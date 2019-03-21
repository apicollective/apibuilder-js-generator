import { map } from 'lodash';

function generateSchemaFromEnum(enm) {
  const enumValues = map(enm.values, value => value.name);
  return {
    [enm.name]: {
      ...enm.description && { description: enm.description },
      ...enm.isDeprecated && { deprecated: enm.isDeprecated },
      enum: enumValues,
      type: 'string',
    },
  };
}

export default generateSchemaFromEnum;
