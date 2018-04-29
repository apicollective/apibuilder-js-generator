import apibuilderType2PropType from '../apibuilder-type-2-prop-type';

describe('utilities > apibuilderType2PropType', () => {
  it('should convert from apibuilder types to react prop types', () => {
    expect(apibuilderType2PropType('string')).toEqual('PropTypes.string');
    expect(apibuilderType2PropType('date-iso8601')).toEqual('PropTypes.string');
    expect(apibuilderType2PropType('date-time-iso8601')).toEqual('PropTypes.string');
    expect(apibuilderType2PropType('uuid')).toEqual('PropTypes.string');
    expect(apibuilderType2PropType('boolean')).toEqual('PropTypes.bool');
    expect(apibuilderType2PropType('decimal')).toEqual('PropTypes.number');
    expect(apibuilderType2PropType('double')).toEqual('PropTypes.number');
    expect(apibuilderType2PropType('integer')).toEqual('PropTypes.number');
    expect(apibuilderType2PropType('long')).toEqual('PropTypes.number');
    expect(apibuilderType2PropType('object')).toEqual('PropTypes.object');
    expect(apibuilderType2PropType('json')).toEqual('PropTypes.any');
    expect(apibuilderType2PropType('unknown')).toEqual('PropTypes.any');
  });
});
