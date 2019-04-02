import {
  reduce,
} from 'lodash';
import {
  generateSchemaEnums,
  generateSchemaModels,
  generateSchemaUnions,
} from '../openapi-schemas';

function generateComponentsObject(service) {
  const schemaModels = generateSchemaModels(service);
  const schemaEnums = generateSchemaEnums(service);
  const schemaUnions = generateSchemaUnions(service);
  const schemas = reduce(
    [].concat(schemaModels, schemaEnums, schemaUnions),
    (acc, value) => {
      return Object.assign(acc, value);
    },
    {},
   );
  return {
    schemas,
  };
}

export default generateComponentsObject;
