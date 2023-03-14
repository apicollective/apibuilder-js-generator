import { SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import { generateSchemaFromEnum } from '.';

function generateSchemaEnums(service: ApiBuilderService): SchemaObject[] {
  return service.enums.map((enm) => generateSchemaFromEnum(enm));
}

export default generateSchemaEnums;
