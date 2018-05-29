const omit = require('lodash/omit');
const values = require('lodash/values');

const FullyQualifiedType = require('../../../../src/utilities/apibuilder/FullyQualifiedType');
const TypeKind = require('../../../../src/utilities/apibuilder/TypeKind');

const primitiveTypes = values(omit(TypeKind, ['UNION', 'ENUM', 'MODEL', 'MAP', 'ARRAY']));

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

describe('FullyQualifiedType.astFromType', () => {
  test('string', () => {
    expect(FullyQualifiedType.astFromType('string')).toEqual({
      name: 'string',
    });
  });

  test('map[string]', () => {
    expect(FullyQualifiedType.astFromType('map[string]')).toEqual({
      name: 'map',
      type: {
        name: 'string',
      },
    });
  });

  test('map[[string]]', () => {
    expect(FullyQualifiedType.astFromType('map[[string]]')).toEqual({
      name: 'map',
      type: {
        name: 'array',
        type: {
          name: 'string',
        },
      },
    });
  });

  test(`map[map[map[[${baseType}]]]`, () => {
    expect(FullyQualifiedType.astFromType(`map[map[map[[${baseType}]]]]`)).toEqual({
      name: 'map',
      type: {
        name: 'map',
        type: {
          name: 'map',
          type: {
            name: 'array',
            type: {
              name: baseType,
            },
          },
        },
      },
    });
  });

  test('[[[[string]]]]', () => {
    expect(FullyQualifiedType.astFromType('[[[[string]]]]')).toEqual({
      name: 'array',
      type: {
        name: 'array',
        type: {
          name: 'array',
          type: {
            name: 'array',
            type: {
              name: 'string',
            },
          },
        },
      },
    });
  });
});

describe('FullyQualifiedType.typeFromAst', () => {
  test('string', () => {
    const ast = FullyQualifiedType.astFromType('string');
    expect(FullyQualifiedType.typeFromAst(ast)).toEqual('string');
  });

  test('map[string]', () => {
    const ast = FullyQualifiedType.astFromType('map[string]');
    expect(FullyQualifiedType.typeFromAst(ast)).toEqual('map[string]');
  });

  test('map[[string]]', () => {
    const ast = FullyQualifiedType.astFromType('map[[string]]');
    expect(FullyQualifiedType.typeFromAst(ast)).toEqual('map[[string]]');
  });

  test(`map[map[map[[${baseType}]]]`, () => {
    const ast = FullyQualifiedType.astFromType(`map[map[map[[${baseType}]]]]`);
    expect(FullyQualifiedType.typeFromAst(ast)).toEqual(`map[map[map[[${baseType}]]]]`);
  });

  test('[[[[string]]]]', () => {
    const ast = FullyQualifiedType.astFromType('[[[[string]]]]');
    expect(FullyQualifiedType.typeFromAst(ast)).toEqual('[[[[string]]]]');
  });
});

describe('FullyQualifiedType.getBaseType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return "${primitiveType}" for type "${primitiveType}"`, () => {
      expect(FullyQualifiedType.getBaseType(primitiveType)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "[${primitiveType}]"`, () => {
      expect(FullyQualifiedType.getBaseType(`[${primitiveType}]`)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "map[${primitiveType}]"`, () => {
      expect(FullyQualifiedType.getBaseType(`map[${primitiveType}]`)).toBe(primitiveType);
    });
  });

  test(`should return "${baseType}" for type "${baseType}"`, () => {
    expect(FullyQualifiedType.getBaseType(baseType)).toBe(baseType);
  });

  test(`should return "${baseType}" for type "[${baseType}]"`, () => {
    expect(FullyQualifiedType.getBaseType(`[${baseType}]`)).toBe(baseType);
  });

  test(`should return "${baseType}" for type "map[${baseType}]"`, () => {
    expect(FullyQualifiedType.getBaseType(`map[${baseType}]`)).toBe(baseType);
  });
});

describe('FullyQualifiedType.isPrimitiveType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return true for type "${primitiveType}"`, () => {
      expect(FullyQualifiedType.isPrimitiveType(primitiveType)).toBe(true);
    });
  });

  test(`should return false for type "${baseType}"`, () => {
    expect(FullyQualifiedType.isPrimitiveType(baseType)).toBe(false);
  });
});
