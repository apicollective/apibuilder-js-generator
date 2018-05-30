const find = require('lodash/find');

const ApiBuilderEnum = require('../../../../src/utilities/apibuilder/ApiBuilderEnum');
const ApiBuilderEnumValue = require('../../../../src/utilities/apibuilder/ApiBuilderEnumValue');
const ApiBuilderService = require('../../../../src/utilities/apibuilder/ApiBuilderService');
const createMockDeprecation = require('../../../helpers/createMockDeprecation');
const createMockEnum = require('../../../helpers/createMockEnum');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

describe('ApiBuilderEnum', () => {
  test('should have static function to create enumeration from schema', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toBeInstanceOf(ApiBuilderEnum);
  });

  test('should define enum type with values', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    instance.values.forEach((value) => {
      expect(value).toBeInstanceOf(ApiBuilderEnumValue);
    });
  });

  test('should define deprecated enum type', () => {
    const enumeration = createMockEnum({ deprecation: createMockDeprecation() });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('deprecation', enumeration.deprecation);
  });

  test('should define other properties from enum schema', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('name', enumeration.name);
    expect(instance).toHaveProperty('plural', enumeration.plural);
    expect(instance).toHaveProperty('description', enumeration.description);
    expect(instance).toHaveProperty('attributes', enumeration.attributes);
  });
});
