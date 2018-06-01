const { astFromTypeName } = require('../../../../src/utilities/apibuilder');

const baseType = 'com.bryzek.apidoc.common.v0.models.reference';

describe('astFromTypeName', () => {
  test('string', () => {
    expect(astFromTypeName('string')).toEqual({
      name: 'string',
    });
  });

  test('map[string]', () => {
    expect(astFromTypeName('map[string]')).toEqual({
      name: 'map',
      type: {
        name: 'string',
      },
    });
  });

  test('map[[string]]', () => {
    expect(astFromTypeName('map[[string]]')).toEqual({
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
    expect(astFromTypeName(`map[map[map[[${baseType}]]]]`)).toEqual({
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
    expect(astFromTypeName('[[[[string]]]]')).toEqual({
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
