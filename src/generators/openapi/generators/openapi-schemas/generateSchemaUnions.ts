import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import { isTypeImported, typeValidator } from '../openapi-utils';
import { generateSchemaFromUnion } from '.';

function generateSchemaUnions(service: ApiBuilderService): SchemaObject[] {
  const typeValidation = typeValidator(service);
  return service.unions.map(
    (union) => generateSchemaFromUnion(union, typeValidation, isTypeImported(service)),
  );
}

export default generateSchemaUnions;
