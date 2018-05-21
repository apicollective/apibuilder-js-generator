const Entity = require('../../../../src/utilities/apibuilder/Entity');
const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new Service({ service: schema });

const primitives = [
  'boolean', 'date-iso8601', 'date-time-iso8601', 'decimal', 'double',
  'integer', 'json', 'long', 'object', 'string', 'unit', 'uuid',
];

describe('Entity::isPrimitive', () => {
  primitives.forEach((primitive) => {
    test(`should be true for a entity of type "${primitive}"`, () => {
      const entity = Entity.fromType(primitive, service);
      expect(entity).toHaveProperty('isPrimitive', true);
    });

    test(`should be true for a entity of type "[${primitive}]"`, () => {
      const entity = Entity.fromType(`[${primitive}]`, service);
      expect(entity).toHaveProperty('isPrimitive', true);
    });

    test(`should be true for a entity of type "map[${primitive}]"`, () => {
      const entity = Entity.fromType(`map[${primitive}]`, service);
      expect(entity).toHaveProperty('isPrimitive', true);
    });
  });

  test('should be false for a entity of type that is considered a model', () => {
    const entity = Entity.fromType('organization', service);
    expect(entity).toHaveProperty('isPrimitive', false);
  });

  test('should be false for a entity of type that is considered an enumeration', () => {
    const entity = Entity.fromType('visibility', service);
    expect(entity).toHaveProperty('isPrimitive', false);
  });

  test('should be false for a entity of type that is considered an union', () => {
    const entity = Entity.fromType('diff', service);
    expect(entity).toHaveProperty('isPrimitive', false);
  });
});

describe('Entity::isMap', () => {
  primitives.forEach((primitive) => {
    test(`should be true for a entity of type "map[${primitive}]"`, () => {
      const entity = Entity.fromType(`map[${primitive}]`, service);
      expect(entity).toHaveProperty('isMap', true);
    });
  });

  test('should be true for a entity of type considered a map of some model', () => {
    const entity = Entity.fromType('map[organization]', service);
    expect(entity).toHaveProperty('isMap', true);
  });

  test('should be true for a entity of type considered a map of some enumeration', () => {
    const entity = Entity.fromType('map[visibility]', service);
    expect(entity).toHaveProperty('isMap', true);
  });

  test('should be true for a entity of type considered a map of some union', () => {
    const entity = Entity.fromType('map[diff]', service);
    expect(entity).toHaveProperty('isMap', true);
  });

  test('should be true for a entity of fully qualified type considered a map of some model', () => {
    const entity = Entity.fromType('map[com.bryzek.apidoc.common.v0.models.audit]', service);
    expect(entity).toHaveProperty('isMap', true);
  });
});

describe('Entity::isArray', () => {
  primitives.forEach((primitive) => {
    test(`should be true for a entity of type "[${primitive}]`, () => {
      const entity = Entity.fromType(`[${primitive}]`, service);
      expect(entity).toHaveProperty('isArray', true);
    });
  });

  test('should be true for a entity of type considered an array of some model', () => {
    const entity = Entity.fromType('[organization]', service);
    expect(entity).toHaveProperty('isArray', true);
  });

  test('should be true for a entity of type considered an array of some enumeration', () => {
    const entity = Entity.fromType('[visibility]', service);
    expect(entity).toHaveProperty('isArray', true);
  });

  test('should be true for a entity of type considered an array of some union', () => {
    const entity = Entity.fromType('[diff]', service);
    expect(entity).toHaveProperty('isArray', true);
  });

  test('should be true for entity of fully qualified type considered an array of some model', () => {
    const entity = Entity.fromType('[com.bryzek.apidoc.common.v0.models.audit]', service);
    expect(entity).toHaveProperty('isArray', true);
  });
});

describe('Field:isModel', () => {
  test('should be true for a entity of type that is considered a model', () => {
    const entity = Entity.fromType('organization', service);
    expect(entity).toHaveProperty('isModel', true);
  });

  test('should be true for a entity of type that is considered an imported model');
});

describe('Entity::fullyQualifiedName', () => {
  primitives.forEach((primitive) => {
    test(`should be "${primitive}" for a entity of type "${primitive}"`, () => {
      const entity = Entity.fromType(primitive, service);
      expect(entity).toHaveProperty('fullyQualifiedName', primitive);
    });
  });

  test('should be "com.bryzek.apidoc.api.v0.enums.visibility" for an enumerable of type "visibility"', () => {
    const entity = Entity.fromType('visibility', service);
    expect(entity).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.enums.visibility');
  });

  test('should be "com.bryzek.apidoc.api.v0.models.organization" for a model of type "organization"', () => {
    const entity = Entity.fromType('organization', service);
    expect(entity).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.models.organization');
  });

  test('should be "com.bryzek.apidoc.api.v0.unions.diff" for an union of type "diff"', () => {
    const entity = Entity.fromType('diff', service);
    expect(entity).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.unions.diff');
  });
});


describe('Entity.fromType', () => {
  test('should create instance from primitive type', () => {
    const instance = Entity.fromType('string', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'string');
  });

  test('should create instance from internal model type', () => {
    const instance = Entity.fromType('application', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should create instance from internal enum type', () => {
    const instance = Entity.fromType('publication', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.enums.publication');
  });

  test('should create instance from internal union type', () => {
    const instance = Entity.fromType('item_detail', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.unions.item_detail');
  });

  test('should create instance from map of internal model', () => {
    const instance = Entity.fromType('map[application]', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should create instance from array of internal model', () => {
    const instance = Entity.fromType('[application]', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should create instance from external model type', () => {
    const instance = Entity.fromType('healthcheck', service);
    expect(instance).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.common.v0.models.healthcheck');
  });
});
