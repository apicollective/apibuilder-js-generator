import stripTypeNamespace from '../strip-type-namespace';

describe('utilities > stripTypeNamespace', () => {
  it('should remove the namespace from apibuilder types', () => {
    expect(stripTypeNamespace('model_name')).toEqual('model_name');
    expect(stripTypeNamespace('io.flow.common.v0.models.model_name')).toEqual('model_name');
  });
});
