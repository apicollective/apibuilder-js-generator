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
  test('should have property with fully qualified name', () => {
    const model = Field.fromSchema(visibility, service);
    expect(model).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.enums.visibility');
  });

  test('should have property with package name', () => {
    const model = Field.fromSchema(visibility, service);
    expect(model).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.enums');
  });
});
