
import generateEnumPropType from '../generator-enumeration';
import loadFixture from '../../../../../test/utilities/load-fixture';

describe('generateEnumPropType', () => {
  it('should generate prop type code from enum entity', () => {
    const entity = {
      id: 'io.flow.test.v0.enum_1',
      name: 'enum_1',
      type: 'enum',
      entity: {
        name: 'enum_1',
        values: [
          { name: 'enum_1_value_1' },
          { name: 'enum_1_value_2' },
        ],
      },
    };

    const propTypeString = generateEnumPropType(entity);
    expect(propTypeString).toEqual(loadFixture(__dirname, './fixtures/enum-prop-type.js.fixture'));
  });
});
