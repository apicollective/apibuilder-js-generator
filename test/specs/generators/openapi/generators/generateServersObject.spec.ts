import { ApiBuilderService } from 'apibuilder-js';
import { generateServersObject } from '../../../../../src/generators/openapi/generators/openapi-servers';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');

describe('generated servers object should have URL', () => {
  const service = new ApiBuilderService(apidocApiJson);
  const serverObject = generateServersObject(service);

  test('url', () => {
    expect(serverObject[0].url).toBe(service.baseUrl);
  })
})