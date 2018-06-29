const pickBy = require('lodash/pickBy');
const values = require('lodash/values');
const { Kind, getBaseTypeName, isPrimitiveTypeName } = require('../../../../src/utilities/apibuilder');

const primitiveTypes = values(pickBy(Kind, isPrimitiveTypeName));

const baseType = 'com.bryzek.apidoc.common.v0.models.reference';

describe('getBaseTypeName', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return "${primitiveType}" for type "${primitiveType}"`, () => {
      expect(getBaseTypeName(primitiveType)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "[${primitiveType}]"`, () => {
      expect(getBaseTypeName(`[${primitiveType}]`)).toBe(primitiveType);
    });

    test(`should return "${primitiveType}" for type "map[${primitiveType}]"`, () => {
      expect(getBaseTypeName(`map[${primitiveType}]`)).toBe(primitiveType);
    });
  });

  test(`should return "${baseType}" for type "${baseType}"`, () => {
    expect(getBaseTypeName(baseType)).toBe(baseType);
  });

  test(`should return "${baseType}" for type "[${baseType}]"`, () => {
    expect(getBaseTypeName(`[${baseType}]`)).toBe(baseType);
  });

  test(`should return "${baseType}" for type "map[${baseType}]"`, () => {
    expect(getBaseTypeName(`map[${baseType}]`)).toBe(baseType);
  });
});
