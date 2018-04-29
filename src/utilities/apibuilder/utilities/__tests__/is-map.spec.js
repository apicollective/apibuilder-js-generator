import isMap from '../is-map';

describe('utilities > isMap', () => {
  it('should detect apibuilder map types', () => {
    expect(isMap('string')).toBeFalsy();
    expect(isMap('[string]')).toBeFalsy();
    expect(isMap('map[string]')).toBeTruthy();
  });
});
