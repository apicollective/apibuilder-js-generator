const find = require('lodash/find');

const {
  ApiBuilderImport,
  ApiBuilderService,
  isEnumType,
  isModelType,
  isUnionType,
} = require('../../../../src/utilities/apibuilder');

const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

const subject = new ApiBuilderImport(find(schema.imports, {
  namespace: 'com.bryzek.apidoc.spec.v0',
  version: '0.11.94',
}), service);

describe('ApiBuilderImport', () => {
  test('should have properties from schema', () => {
    expect(subject).toHaveProperty('namespace', 'com.bryzek.apidoc.spec.v0');
    expect(subject).toHaveProperty('organizationKey', 'bryzek');
    expect(subject).toHaveProperty('applicationKey', 'apidoc-spec');
    expect(subject).toHaveProperty('version', '0.11.94');
  });

  test('should have properties with types from specified schema', () => {
    expect(subject.enums.every(isEnumType)).toBe(true);
    expect(subject.models.every(isModelType)).toBe(true);
    expect(subject.unions.every(isUnionType)).toBe(true);
  });
});

describe('ApiBuilderImport::findEnumByName', () => {
  test('should return type matching short name', () => {
    expect(isEnumType(subject.findEnumByName('parameter_location'))).toBe(true);
  });

  test('should return type matching fully qualified name', () => {
    expect(isEnumType(subject.findEnumByName('com.bryzek.apidoc.spec.v0.enums.parameter_location'))).toBe(true);
  });
});

describe('ApiBuilderImport::findModelByName', () => {
  test('should return type matching short name', () => {
    expect(isModelType(subject.findModelByName('operation'))).toBe(true);
  });

  test('should return type matching fully qualified name', () => {
    expect(isModelType(subject.findModelByName('com.bryzek.apidoc.spec.v0.models.operation'))).toBe(true);
  });
});

describe('ApiBuilderImport::findUnionByName', () => {
  test('should return type matching short name', () => {
    expect(isUnionType(subject.findUnionByName('response_code'))).toBe(true);
  });

  test('should return type matching fully qualified name', () => {
    expect(isUnionType(subject.findUnionByName('com.bryzek.apidoc.spec.v0.unions.response_code'))).toBe(true);
  });
});
