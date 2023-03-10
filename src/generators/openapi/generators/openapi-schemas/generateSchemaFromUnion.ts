import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderUnion } from 'apibuilder-js';
import { fromPairs } from 'lodash';
import { convertApiBuilderType } from '../openapi-utils';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function generateSchemaFromUnion(
  union: ApiBuilderUnion,
  typeValidation,
  isImported: IsImportedChecker,
): SchemaObject {
  const data: [SchemaObject, string][] = union.types.map((t) => {
    const type = convertApiBuilderType(t.type, typeValidation, isImported);
    return [type, t.discriminatorValue];
  });

  const unionTypes = data.map((x) => x[0]);
  const mappings = fromPairs(
    data.map(([type, discriminatorValue]) => [discriminatorValue, type.$ref]),
  );

  return {
    [union.name]: {
      ...union.description && { description: union.description },
      oneOf: unionTypes,
      ...union.discriminator && {
        discriminator: {
          mapping: mappings,
          propertyName: union.discriminator,
        },
      },
    },
  };
}

export default generateSchemaFromUnion;
