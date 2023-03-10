import {
  ApiBuilderService, type ApiBuilderServiceConfig,
} from 'apibuilder-js';
import {
  generateSchemaModels,
} from '../../../../../src/generators/openapi/generators/openapi-schemas';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');

describe('generate schema models', () => {
  const service = new ApiBuilderService(apidocApiJson as ApiBuilderServiceConfig);
  const schemaModels = generateSchemaModels(service);

  test('should return object for imported models', () => {
    const schema = schemaModels.find((models) => models.application != null);
    expect(schema.application.properties.organization).toEqual({});
  });
});
