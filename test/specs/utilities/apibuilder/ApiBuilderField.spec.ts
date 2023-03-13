import { ApiBuilderField, ApiBuilderService } from '../../../../src/utilities/apibuilder';
import apidocApiJson from '../../../fixtures/schemas/apidoc-api.json';
import createMockDeprecation from '../../../helpers/createMockDeprecation';
import createMockField from '../../../helpers/createMockField';

const service = new ApiBuilderService({ service: apidocApiJson });
describe('ApiBuilderField', () => {
  test('should have property with field name', () => {
    const config = createMockField({ type: 'visibility' });
    const field = ApiBuilderField.fromSchema(config, service);
    expect(field).toHaveProperty('name', config.name);
  });

  test('should have property indicating whether field is required', () => {
    const config = createMockField({ type: 'visibility' });
    const field = ApiBuilderField.fromSchema(config, service);
    expect(field).toHaveProperty('isRequired', true);
  });

  test('should have property with field type', () => {
    const config = createMockField({ type: 'visibility' });
    const field = ApiBuilderField.fromSchema(config, service);
    expect(field).toHaveProperty('type.baseType', 'com.bryzek.apidoc.api.v0.enums.visibility');
    expect(field).toHaveProperty('type.packageName', 'com.bryzek.apidoc.api.v0.enums');
  });

  test('should have property with field deprecation reason', () => {
    const config = createMockField({
      type: 'visibility',
      deprecation: createMockDeprecation(),
    });
    const field = ApiBuilderField.fromSchema(config, service);
    expect(field).toHaveProperty('deprecationReason', config.deprecation.description);
  });
});
