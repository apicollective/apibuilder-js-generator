import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import { map } from 'lodash';
import { generateSchemaFromUnion } from '../openapi-schemas';
import { isTypeImported, typeValidator } from '../openapi-utils';

function generateSchemaUnions(service: ApiBuilderService): SchemaObject[] {
  const typeValidation = typeValidator(service);
  return map(service.unions, union =>
    generateSchemaFromUnion(union, typeValidation, isTypeImported(service)));
}

export default generateSchemaUnions;
