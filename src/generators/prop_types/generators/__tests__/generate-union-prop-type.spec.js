import generateUnionPropType from '../generate-union-prop-type';
import loadFixture from '../../../../../test/utilities/load-fixture';

describe('generateUnionPropType', () => {
  it('should generate prop type code from union entity', () => {
    const entity = {
      id: 'io.flow.test.v0.union_1',
      name: 'union_1',
      type: 'union',
      entity: {
        name: 'union_1',
        types: [
          { type: 'model_3' },
          { type: 'model_4' },
        ],
      },
    };

    const propTypeString = generateUnionPropType(entity);

    expect(propTypeString).toEqual(loadFixture(__dirname, './fixtures/union-prop-type.js.fixture'));
  });
});
