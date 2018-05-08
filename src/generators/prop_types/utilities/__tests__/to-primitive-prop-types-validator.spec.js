import toPrimitivePropTypesValidator from '../to-primitive-prop-types-validator';

describe('toPrimitivePropTypesValidator', () => {
  it('should convert from apibuilder types to react prop types', () => {
    expect(toPrimitivePropTypesValidator('string')).toEqual('PropTypes.string');
    expect(toPrimitivePropTypesValidator('date-iso8601')).toEqual('PropTypes.string');
    expect(toPrimitivePropTypesValidator('date-time-iso8601')).toEqual('PropTypes.string');
    expect(toPrimitivePropTypesValidator('uuid')).toEqual('PropTypes.string');
    expect(toPrimitivePropTypesValidator('boolean')).toEqual('PropTypes.bool');
    expect(toPrimitivePropTypesValidator('decimal')).toEqual('PropTypes.number');
    expect(toPrimitivePropTypesValidator('double')).toEqual('PropTypes.number');
    expect(toPrimitivePropTypesValidator('integer')).toEqual('PropTypes.number');
    expect(toPrimitivePropTypesValidator('long')).toEqual('PropTypes.number');
    expect(toPrimitivePropTypesValidator('object')).toEqual('PropTypes.object');
    expect(toPrimitivePropTypesValidator('json')).toEqual('PropTypes.any');
    expect(toPrimitivePropTypesValidator('unknown')).toEqual('PropTypes.any');
  });
});
