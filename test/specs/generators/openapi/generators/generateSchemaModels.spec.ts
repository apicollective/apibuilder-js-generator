import {
  ApiBuilderService,
} from 'apibuilder-js';
import {
  generateSchemaModels,
} from '../../../../../src/generators/openapi/generators/openapi-schemas';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');
import { isTypeImported } from '../../../../../src/generators/openapi/generators/openapi-utils';

describe('generate schema models', () => {
  const service = new ApiBuilderService(apidocApiJson);
  const schemaModels = generateSchemaModels(service);

  test('should return object for imported models', () => {
    const schema = schemaModels.find(models => models.application != null);
    expect(schema.application.properties['organization']).toEqual({});
  });
});