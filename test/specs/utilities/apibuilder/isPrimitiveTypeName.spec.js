const pickBy = require('lodash/pickBy');
const values = require('lodash/values');
const { Kind, isPrimitiveTypeName } = require('../../../../src/utilities/apibuilder');

const primitiveTypes = values(pickBy(Kind, isPrimitiveTypeName));

const baseType = 'com.bryzek.apidoc.common.v0.models.reference';

describe('isPrimitiveType', () => {
  primitiveTypes.forEach((primitiveType) => {
    test(`should return true for type "${primitiveType}"`, () => {
      expect(isPrimitiveTypeName(primitiveType)).toBe(true);
    });
  });

  test(`should return false for type "${baseType}"`, () => {
    expect(isPrimitiveTypeName(baseType)).toBe(false);
  });
});
