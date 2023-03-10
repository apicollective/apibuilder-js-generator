import { ApiBuilderService, type ApiBuilderServiceConfig } from 'apibuilder-js';
import { generateInfoObject } from '../../../../../src/generators/openapi/generators/openapi-info';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');

describe('generated info object should have correct properties', () => {
  const service = new ApiBuilderService(apidocApiJson as ApiBuilderServiceConfig);
  const infoObject = generateInfoObject(service);

  test('contact', () => {
    expect(infoObject.contact).toBe(service.info.contact);
  });

  test('description', () => {
    expect(infoObject.description).toBe(service.description);
  });

  test('license', () => {
    expect(infoObject.license).toBe(service.info.license);
  });

  test('terms of service', () => {
    expect(infoObject.termsOfService).toBe('');
  });

  test('title', () => {
    expect(infoObject.title).toBe(service.name);
  });

  test('version', () => {
    expect(infoObject.version).toBe(service.version);
  });
});
