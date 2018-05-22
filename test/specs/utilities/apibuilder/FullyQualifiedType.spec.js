const FullyQualifiedType = require('../../../../src/utilities/apibuilder/FullyQualifiedType');

const primitiveTypes = [
  'boolean',
  'date-iso8601',
  'date-time-iso8601',
  'decimal',
  'double',
  'integer',
  'json',
  'long',
  'object',
  'string',
  'unit',
  'uuid',
];

const fullyQualifiedName = 'com.bryzek.apidoc.common.v0.models.reference';

describe('FullyQualifiedType::fullyQualifiedName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be "${primitiveType}" for instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedType(primitiveType);
      expect(instance).toHaveProperty('fullyQualifiedName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`[${primitiveType}]`);
      expect(instance).toHaveProperty('fullyQualifiedName', primitiveType);
    });

    test(`should be "${primitiveType}" for instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('fullyQualifiedName', primitiveType);
    });
  });

  test(`should be "${fullyQualifiedName}" for instance of type "${fullyQualifiedName}"`, () => {
    const instance = new FullyQualifiedType(fullyQualifiedName);
    expect(instance).toHaveProperty('fullyQualifiedName', fullyQualifiedName);
  });

  test(`should be "${fullyQualifiedName}" for instance of type "[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('fullyQualifiedName', fullyQualifiedName);
  });

  test(`should be "${fullyQualifiedName}" for instance of type "map[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`map[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('fullyQualifiedName', fullyQualifiedName);
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

  test(`should be "${fullyQualifiedName}" for instance of type "${fullyQualifiedName}"`, () => {
    const instance = new FullyQualifiedType(fullyQualifiedName);
    expect(instance).toHaveProperty('shortName', 'reference');
  });

  test(`should be "${fullyQualifiedName}" for instance of type "[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('shortName', 'reference');
  });

  test(`should be "${fullyQualifiedName}" for instance of type "map[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`map[${fullyQualifiedName}]`);
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

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "${fullyQualifiedName}"`, () => {
    const instance = new FullyQualifiedType(fullyQualifiedName);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });

  test(`should be "com.bryzek.apidoc.common.v0.models" for instance of type "map[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`map[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('packageName', 'com.bryzek.apidoc.common.v0.models');
  });
});

describe('FullyQualifiedType::isArray', () => {
  test('should be true for instance of type "[string]"', () => {
    const instance = new FullyQualifiedType('[string]');
    expect(instance).toHaveProperty('isArray', true);
  });

  test(`should be true for instance of type [${fullyQualifiedName}]`, () => {
    const instance = new FullyQualifiedType(`[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('isArray', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedType('string');
    expect(instance).toHaveProperty('isArray', false);
  });

  test(`should be true for instance of type ${fullyQualifiedName}`, () => {
    const instance = new FullyQualifiedType(`${fullyQualifiedName}`);
    expect(instance).toHaveProperty('isArray', false);
  });
});

describe('FullyQualifiedType::isMap', () => {
  test('should be true for instance of type "map[string]"', () => {
    const instance = new FullyQualifiedType('map[string]');
    expect(instance).toHaveProperty('isMap', true);
  });

  test(`should be true for instance of type map[${fullyQualifiedName}]`, () => {
    const instance = new FullyQualifiedType(`map[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('isMap', true);
  });

  test('should be false for instance of type "string"', () => {
    const instance = new FullyQualifiedType('string');
    expect(instance).toHaveProperty('isMap', false);
  });

  test(`should be true for instance of type ${fullyQualifiedName}`, () => {
    const instance = new FullyQualifiedType(`${fullyQualifiedName}`);
    expect(instance).toHaveProperty('isMap', false);
  });
});

describe('FullyQualifiedType::isPrimitive', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should be true for an instance of type "${primitiveType}"`, () => {
      const instance = new FullyQualifiedType(primitiveType);
      expect(instance).toHaveProperty('isPrimitive', true);
    });

    test(`should be true for an instance of type "[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`[${primitiveType}]`);
      expect(instance).toHaveProperty('isPrimitive', true);
    });

    test(`should be true for an instance of type "map[${primitiveType}]"`, () => {
      const instance = new FullyQualifiedType(`map[${primitiveType}]`);
      expect(instance).toHaveProperty('isPrimitive', true);
    });
  });

  test(`should be false for an instance of type "${fullyQualifiedName}"`, () => {
    const instance = new FullyQualifiedType(fullyQualifiedName);
    expect(instance).toHaveProperty('isPrimitive', false);
  });

  test(`should be false for an instance of type "[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('isPrimitive', false);
  });

  test(`should be false for an instance of type "map[${fullyQualifiedName}]"`, () => {
    const instance = new FullyQualifiedType(`map[${fullyQualifiedName}]`);
    expect(instance).toHaveProperty('isPrimitive', false);
  });
});

describe('FullyQualifiedType.parseType', () => {
  test('string', () => {
    expect(FullyQualifiedType.parseType('string')).toEqual({
      name: 'string',
    });
  });

  test('map[string]', () => {
    expect(FullyQualifiedType.parseType('map[string]')).toEqual({
      name: 'map',
      type: {
        name: 'string',
      },
    });
  });

  test('map[[string]]', () => {
    expect(FullyQualifiedType.parseType('map[[string]]')).toEqual({
      name: 'map',
      type: {
        name: 'array',
        type: {
          name: 'string',
        },
      },
    });
  });

  test(`map[map[map[[${fullyQualifiedName}]]]`, () => {
    expect(FullyQualifiedType.parseType(`map[map[map[[${fullyQualifiedName}]]]]`)).toEqual({
      name: 'map',
      type: {
        name: 'map',
        type: {
          name: 'map',
          type: {
            name: 'array',
            type: {
              name: fullyQualifiedName,
            },
          },
        },
      },
    });
  });

  test('[[[[string]]]]', () => {
    expect(FullyQualifiedType.parseType('[[[[string]]]]')).toEqual({
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

describe('FullyQualifiedType.formatType', () => {
  test('string', () => {
    const object = {
      name: 'string',
    };
    expect(FullyQualifiedType.formatType(object)).toEqual('string');
  });

  test('map[string]', () => {
    const object = {
      name: 'map',
      type: {
        name: 'string',
      },
    };
    expect(FullyQualifiedType.formatType(object)).toEqual('map[string]');
  });

  test('map[[string]]', () => {
    const object = {
      name: 'map',
      type: {
        name: 'array',
        type: {
          name: 'string',
        },
      },
    };
    expect(FullyQualifiedType.formatType(object)).toEqual('map[[string]]');
  });

  test(`map[map[map[[${fullyQualifiedName}]]]`, () => {
    const object = {
      name: 'map',
      type: {
        name: 'map',
        type: {
          name: 'map',
          type: {
            name: 'array',
            type: {
              name: fullyQualifiedName,
            },
          },
        },
      },
    };
    expect(FullyQualifiedType.formatType(object)).toEqual(`map[map[map[[${fullyQualifiedName}]]]]`);
  });

  test('[[[[string]]]]', () => {
    const object = {
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
    };
    expect(FullyQualifiedType.formatType(object)).toEqual('[[[[string]]]]');
  });
});

describe('FullyQualifiedType.toBaseType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return "${primitiveType}" for type "${primitiveType}"`, () => {
      expect(FullyQualifiedType.toBaseType(primitiveType)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "[${primitiveType}]"`, () => {
      expect(FullyQualifiedType.toBaseType(`[${primitiveType}]`)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "map[${primitiveType}]"`, () => {
      expect(FullyQualifiedType.toBaseType(`map[${primitiveType}]`)).toBe(primitiveType);
    });
  });

  test(`should return "${fullyQualifiedName}" for type "${fullyQualifiedName}"`, () => {
    expect(FullyQualifiedType.toBaseType(fullyQualifiedName)).toBe(fullyQualifiedName);
  });

  test(`should return "${fullyQualifiedName}" for type "[${fullyQualifiedName}]"`, () => {
    expect(FullyQualifiedType.toBaseType(`[${fullyQualifiedName}]`)).toBe(fullyQualifiedName);
  });

  test(`should return "${fullyQualifiedName}" for type "map[${fullyQualifiedName}]"`, () => {
    expect(FullyQualifiedType.toBaseType(`map[${fullyQualifiedName}]`)).toBe(fullyQualifiedName);
  });
});

describe('FullyQualifiedType.isPrimitiveType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return true for type "${primitiveType}"`, () => {
      expect(FullyQualifiedType.isPrimitiveType(primitiveType)).toBe(true);
    });
  });

  test(`should return false for type "${fullyQualifiedName}"`, () => {
    expect(FullyQualifiedType.isPrimitiveType(fullyQualifiedName)).toBe(false);
  });
});
