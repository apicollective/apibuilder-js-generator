import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderUnion } from 'apibuilder-js';
import { map } from 'lodash';
import { convertApiBuilderType } from '../openapi-utils';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateSchemaFromUnion(
  union: ApiBuilderUnion,
  typeValidation,
  isImported: IsImportedChecker,
): SchemaObject {
  const unionTypes = union.types.map((t) => {
    const model = convertApiBuilderType(t.type, typeValidation, isImported);
    return (union.discriminator && t.discriminatorValue)
      ? {
        ...model,
        properties: {
          [union.discriminator]: {
            enum: [t.discriminatorValue],
          },
        },
      }
      : model;
  });
  return {
    [union.name]: {
      ...union.description && { description:  union.description },
      oneOf: unionTypes,
      ...union.discriminator && {
        discriminator: {
          propertyName: union.discriminator,
        },
      },
    },
  };
}

export default generateSchemaFromUnion;
