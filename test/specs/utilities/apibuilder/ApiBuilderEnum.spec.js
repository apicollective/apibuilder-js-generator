const find = require('lodash/find');

const ApiBuilderEnum = require('../../../../src/utilities/apibuilder/ApiBuilderEnum');
const ApiBuilderService = require('../../../../src/utilities/apibuilder/ApiBuilderService');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

describe('ApiBuilderEnum', () => {
  test('should have static property to create enumeration from schema', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toBeInstanceOf(ApiBuilderEnum);
  });

  test('should have property with fully qualified base type', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.enums.visibility');
  });

  test('should have property with package name', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.enums');
  });
});
