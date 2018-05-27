const find = require('lodash/find');

const Enumeration = require('../../../../src/utilities/apibuilder/Enumeration');
const ApiBuilderService = require('../../../../src/utilities/apibuilder/ApiBuilderService');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

describe('Enumeration', () => {
  test('should have static property to create enumeration from schema', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = Enumeration.fromSchema(enumeration, service);
    expect(instance).toBeInstanceOf(Enumeration);
  });

  test('should have property with fully qualified base type', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = Enumeration.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.enums.visibility');
  });

  test('should have property with package name', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = Enumeration.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.enums');
  });
});
