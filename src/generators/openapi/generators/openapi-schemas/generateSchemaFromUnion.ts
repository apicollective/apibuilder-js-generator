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
  const types = map(union.types, t => t.type);
  const unionTypes = map(types, t => convertApiBuilderType(t, typeValidation, isImported));
  return {
    [union.name]: {
      ...union.description && { description:  union.description },
      oneOf: unionTypes,
    },
  };
}

export default generateSchemaFromUnion;
