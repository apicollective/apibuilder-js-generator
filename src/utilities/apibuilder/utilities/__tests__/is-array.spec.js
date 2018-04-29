import isArray from '../is-array';

describe('utilities > isArray', () => {
  it('should detect apibuilder array types', () => {
    expect(isArray('string')).toBeFalsy();
    expect(isArray('[string]')).toBeTruthy();
    expect(isArray('map[string]')).toBeFalsy();
  });
});
