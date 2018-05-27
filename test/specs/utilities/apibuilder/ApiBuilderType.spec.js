const ApiBuilderType = require('../../../../src/utilities/apibuilder/ApiBuilderType');
const ApiBuilderService = require('../../../../src/utilities/apibuilder/ApiBuilderService');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

const primitives = [
  'boolean', 'date-iso8601', 'date-time-iso8601', 'decimal', 'double',
  'integer', 'json', 'long', 'object', 'string', 'unit', 'uuid',
];

describe('ApiBuilderType::isPrimitiveType', () => {
  primitives.forEach((primitive) => {
    test(`should be true for a instance of type "${primitive}"`, () => {
      const instance = ApiBuilderType.fromType(primitive, service);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });

    test(`should be true for a instance of type "[${primitive}]"`, () => {
      const instance = ApiBuilderType.fromType(`[${primitive}]`, service);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });

    test(`should be true for a instance of type "map[${primitive}]"`, () => {
      const instance = ApiBuilderType.fromType(`map[${primitive}]`, service);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });
  });

  test('should be true for instance of type "map[[string]]"', () => {
    const instance = ApiBuilderType.fromType('map[[string]]');
    expect(instance).toHaveProperty('isPrimitiveType', true);
  });

  test('should be true for instance for type "[[string]]"', () => {
    const instance = ApiBuilderType.fromType('[[string]]');
    expect(instance).toHaveProperty('isPrimitiveType', true);
  });

  test('should be false for a instance of type that is considered a model', () => {
    const instance = ApiBuilderType.fromType('organization', service);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });

  test('should be false for a instance of type that is considered an enumeration', () => {
    const instance = ApiBuilderType.fromType('visibility', service);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });

  test('should be false for a instance of type that is considered an union', () => {
    const instance = ApiBuilderType.fromType('diff', service);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });
});

describe('ApiBuilderType::isMapType', () => {
  primitives.forEach((primitive) => {
    test(`should be true for a instance of type "map[${primitive}]"`, () => {
      const instance = ApiBuilderType.fromType(`map[${primitive}]`, service);
      expect(instance).toHaveProperty('isMapType', true);
    });
  });

  test('should be true for instance of type "map[[string]]"', () => {
    const instance = ApiBuilderType.fromType('map[[string]]');
    expect(instance).toHaveProperty('isMapType', true);
  });

  test('should be true for a instance of type considered a map of some model', () => {
    const instance = ApiBuilderType.fromType('map[organization]', service);
    expect(instance).toHaveProperty('isMapType', true);
  });

  test('should be true for a instance of type considered a map of some enumeration', () => {
    const instance = ApiBuilderType.fromType('map[visibility]', service);
    expect(instance).toHaveProperty('isMapType', true);
  });

  test('should be true for a instance of type considered a map of some union', () => {
    const instance = ApiBuilderType.fromType('map[diff]', service);
    expect(instance).toHaveProperty('isMapType', true);
  });

  test('should be true for a instance of fully qualified type considered a map of some model', () => {
    const instance = ApiBuilderType.fromType('map[com.bryzek.apidoc.common.v0.models.audit]', service);
    expect(instance).toHaveProperty('isMapType', true);
  });
});

describe('ApiBuilderType::isArrayType', () => {
  primitives.forEach((primitive) => {
    test(`should be true for a instance of type "[${primitive}]`, () => {
      const instance = ApiBuilderType.fromType(`[${primitive}]`, service);
      expect(instance).toHaveProperty('isArrayType', true);
    });
  });

  test('should be true for instance of type "[map[string]]"', () => {
    const instance = ApiBuilderType.fromType('[map[string]]');
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test('should be true for a instance of type considered an array of some model', () => {
    const instance = ApiBuilderType.fromType('[organization]', service);
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test('should be true for a instance of type considered an array of some enumeration', () => {
    const instance = ApiBuilderType.fromType('[visibility]', service);
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test('should be true for a instance of type considered an array of some union', () => {
    const instance = ApiBuilderType.fromType('[diff]', service);
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test('should be true for instance of fully qualified type considered an array of some model', () => {
    const instance = ApiBuilderType.fromType('[com.bryzek.apidoc.common.v0.models.audit]', service);
    expect(instance).toHaveProperty('isArrayType', true);
  });
});

describe('ApiBuilderType:isModel', () => {
  test('should be true for a instance of type that is considered a model', () => {
    const instance = ApiBuilderType.fromType('organization', service);
    expect(instance).toHaveProperty('isModel', true);
  });

  test('should be true for a instance of type that is considered an imported model');
});

describe('ApiBuilderType::baseType', () => {
  primitives.forEach((primitive) => {
    test(`should be "${primitive}" for a instance of type "${primitive}"`, () => {
      const instance = ApiBuilderType.fromType(primitive, service);
      expect(instance).toHaveProperty('baseType', primitive);
    });
  });

  test('should be "com.bryzek.apidoc.api.v0.enums.visibility" for an enumerable of type "visibility"', () => {
    const instance = ApiBuilderType.fromType('visibility', service);
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.enums.visibility');
  });

  test('should be "com.bryzek.apidoc.api.v0.models.organization" for a model of type "organization"', () => {
    const instance = ApiBuilderType.fromType('organization', service);
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.organization');
  });

  test('should be "com.bryzek.apidoc.api.v0.unions.diff" for an union of type "diff"', () => {
    const instance = ApiBuilderType.fromType('diff', service);
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.unions.diff');
  });
});


describe('ApiBuilderType.fromType', () => {
  test('should create instance from primitive type', () => {
    const instance = ApiBuilderType.fromType('string', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'string');
    expect(instance).toHaveProperty('baseType', 'string');
  });

  test('should create instance from array of primitive type', () => {
    const instance = ApiBuilderType.fromType('[string]', service);
    expect(instance).toHaveProperty('fullyQualifiedType', '[string]');
    expect(instance).toHaveProperty('baseType', 'string');
  });

  test('should create instance from map of primitive type', () => {
    const instance = ApiBuilderType.fromType('map[string]', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'map[string]');
    expect(instance).toHaveProperty('baseType', 'string');
  });

  test('should create instance from map[[string]] type', () => {
    const instance = ApiBuilderType.fromType('map[[string]]', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'map[[string]]');
    expect(instance).toHaveProperty('baseType', 'string');
  });

  test('should create instance from [[string]] type', () => {
    const instance = ApiBuilderType.fromType('[[string]]', service);
    expect(instance).toHaveProperty('fullyQualifiedType', '[[string]]');
    expect(instance).toHaveProperty('baseType', 'string');
  });

  test('should create instance from internal model type', () => {
    const instance = ApiBuilderType.fromType('application', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'com.bryzek.apidoc.api.v0.models.application');
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should create instance from internal enum type', () => {
    const instance = ApiBuilderType.fromType('publication', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'com.bryzek.apidoc.api.v0.enums.publication');
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.enums.publication');
  });

  test('should create instance from internal union type', () => {
    const instance = ApiBuilderType.fromType('item_detail', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'com.bryzek.apidoc.api.v0.unions.item_detail');
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.unions.item_detail');
  });

  test('should create instance from map of internal model', () => {
    const instance = ApiBuilderType.fromType('map[application]', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'map[com.bryzek.apidoc.api.v0.models.application]');
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should create instance from array of internal model', () => {
    const instance = ApiBuilderType.fromType('[application]', service);
    expect(instance).toHaveProperty('fullyQualifiedType', '[com.bryzek.apidoc.api.v0.models.application]');
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should create instance from external model type', () => {
    const instance = ApiBuilderType.fromType('healthcheck', service);
    expect(instance).toHaveProperty('fullyQualifiedType', 'com.bryzek.apidoc.common.v0.models.healthcheck');
    expect(instance).toHaveProperty('baseType', 'com.bryzek.apidoc.common.v0.models.healthcheck');
  });
});
