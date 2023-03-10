import pickBy from 'lodash/pickBy';
import values from 'lodash/values';
import { isPrimitiveTypeName, Kind } from '../../../../src/utilities/apibuilder';

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
