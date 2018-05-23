const Field = require('../../../../src/utilities/apibuilder/Field');
const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });

const visibility = { // ENUM
  name: 'visibility',
  type: 'visibility',
  required: true,
  attributes: [],
  annotations: [],
  description: 'Controls who is able to view this application',
};

describe('Field', () => {
  test('should have property with field name', () => {
    const field = Field.fromSchema(visibility, service);
    expect(field).toHaveProperty('name', 'visibility');
  });

  test('should have property indicating whether field is required', () => {
    const field = Field.fromSchema(visibility, service);
    expect(field).toHaveProperty('isRequired', true);
  });

  test('should have property with field type as entity', () => {
    const field = Field.fromSchema(visibility, service);
    expect(field).toHaveProperty('type.fullyQualifiedName', 'com.bryzek.apidoc.api.v0.enums.visibility');
    expect(field).toHaveProperty('type.packageName', 'com.bryzek.apidoc.api.v0.enums');
  });
});
