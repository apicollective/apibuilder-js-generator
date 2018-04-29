import getRootType from '../get-root-type';

describe('utilities > getRootType', () => {
  it('should get the root type from various apibuilder metatypes', () => {
    expect(getRootType('string')).toEqual('string');
    expect(getRootType('[string]')).toEqual('string');
    expect(getRootType('map[string]')).toEqual('string');
    expect(getRootType('date-time-iso8601')).toEqual('date-time-iso8601');
    expect(getRootType('[date-time-iso8601]')).toEqual('date-time-iso8601');
  });
});
