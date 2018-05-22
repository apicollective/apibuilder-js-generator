const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });

describe('Service', () => {
  test('should have property with name', () => {
    expect(service).toHaveProperty('name', schema.name);
  });

  test('should have property with organization key', () => {
    expect(service).toHaveProperty('organizationKey', schema.organization.key);
  });

  test('should have property with namespace', () => {
    expect(service).toHaveProperty('namespace', schema.namespace);
  });

  test('should have property with version', () => {
    expect(service).toHaveProperty('version', schema.version);
  });
});
