import { ComponentsObject, SchemaObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import {
  generateSchemaEnums,
  generateSchemaModels,
  generateSchemaUnions,
} from '../openapi-schemas';

function generateComponentsObject(service: ApiBuilderService): ComponentsObject {
  const schemaModels = generateSchemaModels(service);
  const schemaEnums = generateSchemaEnums(service);
  const schemaUnions = generateSchemaUnions(service);
  const schemas = [...schemaModels, ...schemaEnums, ...schemaUnions].reduce<SchemaObject>(
    (acc, value) => ({
      ...acc,
      ...value,
    }),
    {},
  );
  return {
    schemas,
  };
}

export default generateComponentsObject;
