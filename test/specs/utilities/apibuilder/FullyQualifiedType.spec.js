const pickBy = require('lodash/pickBy');
const values = require('lodash/values');

const { FullyQualifiedType, Kind, isPrimitiveTypeName } = require('../../../../src/utilities/apibuilder');

const primitiveTypes = values(pickBy(Kind, isPrimitiveTypeName));

const baseType = 'com.bryzek.apidoc.common.v0.models.reference';

describe('FullyQualifiedType::baseType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be "${primitiveType}" for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedType(primitiveType);
      expect(instance).toHaveProperty('baseType', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`[${primitiveType}]`);
      expect(instance).toHaveProperty('baseType', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('baseType', primitiveType);
    });
  });

  test(`should be "${baseType}" for instance of type "${baseType}"`, () => {
    const instance = new FullyQualifiedType(baseType);
    expect(instance).toHaveProperty('baseType', baseType);
  });

  test(`should be "${baseType}" for instance of type "[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`[${baseType}]`);
    expect(instance).toHaveProperty('baseType', baseType);
  });

  test(`should be "${baseType}" for instance of type "map[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`map[${baseType}]`);
    expect(instance).toHaveProperty('baseType', baseType);
  });
});

describe('FullyQualifiedType::nestedType', () => {
  test('should be "string" for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedType('map[string]');
    expect(instance).toHaveProperty('nestedType', 'string');
  });

  test('should be "string" for instance of type "[string]"', () => {
    const instance = new FullyQualifiedType('[string]');
    expect(instance).toHaveProperty('nestedType', 'string');
  });

  test('should be "[string]" for instance of type "map[[string]]"', () => {
    const instance = new FullyQualifiedType('map[[string]]');
    expect(instance).toHaveProperty('nestedType', '[string]');
  });

  test('should be "io.flow.v0.models.experience" for instance of type "[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedType('[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('nestedType', 'io.flow.v0.models.experience');
  });

  test('should be "io.flow.v0.models.experience" for instance of type "map[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedType('map[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('nestedType', 'io.flow.v0.models.experience');
  });

  test('should be "string" for instance of type "string"', () => {
    const instance = new FullyQualifiedType('string');
    expect(instance).toHaveProperty('nestedType', 'string');
  });

  test('should be "io.flow.v0.models.experience" for instance of type "io.flow.v0.models.experience"', () => {
    const instance = new FullyQualifiedType('io.flow.v0.models.experience');
    expect(instance).toHaveProperty('nestedType', 'io.flow.v0.models.experience');
  });
});

describe('FullyQualifiedType::shortName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be "${primitiveType}" for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedType(primitiveType);
      expect(instance).toHaveProperty('shortName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`[${primitiveType}]`);
      expect(instance).toHaveProperty('shortName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('shortName', primitiveType);
    });
  });

  test(`should be "${baseType}" for instance of type "${baseType}"`, () => {
    const instance = new FullyQualifiedType(baseType);
    expect(instance).toHaveProperty('shortName', 'reference');
  });

  test(`should be "${baseType}" for instance of type "[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`[${baseType}]`);
    expect(instance).toHaveProperty('shortName', 'reference');
  });

  test(`should be "${baseType}" for instance of type "map[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`map[${baseType}]`);
    expect(instance).toHaveProperty('shortName', 'reference');
  });
});

describe('FullyQualifiedType::packageName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be empty string for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedType(primitiveType);
      expect(instance).toHaveProperty('packageName', '');
    });

    test(`should be empty string for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`[${primitiveType}]`);
      expect(instance).toHaveProperty('packageName', '');
    });

    test(`should be empty string for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('packageName', '');
    });
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "${baseType}"`, () => {
    const instance = new FullyQualifiedType(baseType);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`[${baseType}]`);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "map[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`map[${baseType}]`);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });
});

describe('FullyQualifiedType::isArrayType', () => {
  test('should be true for instance of type "[string]"', () => {
    const instance = new FullyQualifiedType('[string]');
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test(`should be true for instance of type [${baseType}]`, () => {
    const instance = new FullyQualifiedType(`[${baseType}]`);
    expect(instance).toHaveProperty('isArrayType', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedType('string');
    expect(instance).toHaveProperty('isArrayType', false);
  });

  test(`should be true for instance of type ${baseType}`, () => {
    const instance = new FullyQualifiedType(`${baseType}`);
    expect(instance).toHaveProperty('isArrayType', false);
  });
});

describe('FullyQualifiedType::isMapType', () => {
  test('should be true for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedType('map[string]');
    expect(instance).toHaveProperty('isMapType', true);
  });

  test(`should be true for instance of type map[${baseType}]`, () => {
    const instance = new FullyQualifiedType(`map[${baseType}]`);
    expect(instance).toHaveProperty('isMapType', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedType('string');
    expect(instance).toHaveProperty('isMapType', false);
  });

  test(`should be true for instance of type ${baseType}`, () => {
    const instance = new FullyQualifiedType(`${baseType}`);
    expect(instance).toHaveProperty('isMapType', false);
  });
});

describe('FullyQualifiedType::isEnclosingType', () => {
  test('should be true for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedType('map[string]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "[string]"', () => {
    const instance = new FullyQualifiedType('[string]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "map[[string]]"', () => {
    const instance = new FullyQualifiedType('map[[string]]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedType('[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be true for instance of type "map[io.flow.v0.models.experience]"', () => {
    const instance = new FullyQualifiedType('map[io.flow.v0.models.experience]');
    expect(instance).toHaveProperty('isEnclosingType', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedType('string');
    expect(instance).toHaveProperty('isEnclosingType', false);
  });

  test('should be false for instance of type "io.flow.v0.models.experience"', () => {
    const instance = new FullyQualifiedType('io.flow.v0.models.experience');
    expect(instance).toHaveProperty('isEnclosingType', false);
  });
});

describe('FullyQualifiedType::isPrimitiveType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be true for an instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedType(primitiveType);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });

    test(`should be true for an instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`[${primitiveType}]`);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });

    test(`should be true for an instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('isPrimitiveType', true);
    });
  });

  test(`should be false for an instance of type "${baseType}"`, () => {
    const instance = new FullyQualifiedType(baseType);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });

  test(`should be false for an instance of type "[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`[${baseType}]`);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });

  test(`should be false for an instance of type "map[${baseType}]"`, () => {
    const instance = new FullyQualifiedType(`map[${baseType}]`);
    expect(instance).toHaveProperty('isPrimitiveType', false);
  });
});
