const faker = require('faker');

const ApiBuilderEnumValue = require('../../../../src/utilities/apibuilder/ApiBuilderEnumValue');
const createMockDeprecation = require('../../../helpers/createMockDeprecation');
const createMockEnumValue = require('../../../helpers/createMockEnumValue');

describe('ApiBuilderEnumValue', () => {
  test('should accept well defined enum value schema', () => {
    const config = createMockEnumValue({
      description: faker.lorem.sentence(),
    });
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('name', config.name);
    expect(instance).toHaveProperty('description', config.description);
    expect(instance).toHaveProperty('attributes', config.attributes);
    expect(instance).toHaveProperty('deprecation', config.deprecation);
  });

  test('should define a deprecated enum value type', () => {
    const config = createMockEnumValue({
      deprecation: createMockDeprecation(),
    });
    const instance = new ApiBuilderEnumValue(config);
    expect(instance).toHaveProperty('deprecation', config.deprecation);
  });
});
