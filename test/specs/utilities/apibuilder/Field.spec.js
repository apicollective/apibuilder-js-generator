const Field = require('../../../../src/utilities/apibuilder/Field');
const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');
const createMockField = require('../../../helpers/createMockField');
const createMockDeprecation = require('../../../helpers/createMockDeprecation');

const service = new Service({ service: schema });
describe('Field', () => {
  test('should have property with field name', () => {
    const config = createMockField({ type: 'visibility' });
    const field = Field.fromSchema(config, service);
    expect(field).toHaveProperty('name', config.name);
  });

  test('should have property indicating whether field is required', () => {
    const config = createMockField({ type: 'visibility' });
    const field = Field.fromSchema(config, service);
    expect(field).toHaveProperty('isRequired', true);
  });

  test('should have property with field type as entity', () => {
    const config = createMockField({ type: 'visibility' });
    const field = Field.fromSchema(config, service);
    expect(field).toHaveProperty('type.baseType', 'com.bryzek.apidoc.api.v0.enums.visibility');
    expect(field).toHaveProperty('type.packageName', 'com.bryzek.apidoc.api.v0.enums');
  });

  test('should have property with field deprecation reason', () => {
    const config = createMockField({
      type: 'visibility',
      deprecation: createMockDeprecation(),
    });
    const field = Field.fromSchema(config, service);
    expect(field).toHaveProperty('deprecationReason', config.deprecation.description);
  });
});
