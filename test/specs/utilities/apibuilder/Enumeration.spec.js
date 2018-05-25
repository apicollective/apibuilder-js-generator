const find = require('lodash/find');

const Enumeration = require('../../../../src/utilities/apibuilder/Enumeration');
const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });

describe('Enumeration', () => {
  test('should have static property to create enumeration from schema', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = Enumeration.fromSchema(enumeration, service);
    expect(instance).toBeInstanceOf(Enumeration);
  });

  test('should have property with fully qualified name', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = Enumeration.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.enums.visibility');
  });

  test('should have property with package name', () => {
    const enumeration = find(schema.enums, { name: 'visibility' });
    const instance = Enumeration.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.enums');
  });
});
