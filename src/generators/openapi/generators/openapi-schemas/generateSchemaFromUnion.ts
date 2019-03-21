import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderUnion } from 'apibuilder-js';
import { map } from 'lodash';
import { convertApiBuilderType } from '../openapi-utils';

function generateSchemaFromUnion(union: ApiBuilderUnion, typeValidation): SchemaObject {
  const types = map(union.types, t => t.type);
  const unionTypes = map(types, t => convertApiBuilderType(t, typeValidation));
  return {
    [union.name]: {
      ...union.description && { description:  union.description },
      oneOf: unionTypes,
    },
  };
}

export default generateSchemaFromUnion;
