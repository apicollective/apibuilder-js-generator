import Service from '../../../../utilities/apibuilder/Service';

import generateModelPropType from '../generate-model-prop-type';
import loadFixture from '../../../../../test/utilities/load-fixture';

describe('generateModelPropType', () => {
  const apiDefinition = {
    service: {
      organization: { key: 'test-organization' },
      application: { key: 'test-application' },
      imports: [],
      namespace: 'io.flow.v0',
      enums: [
        { name: 'enum_1', values: [{ name: 'enum_1_value_1' }] },
        { name: 'enum_2', values: [{ name: 'enum_2_value_2' }] },
      ],
      unions: [
        { name: 'union_1', types: [{ type: 'model_3' }, { type: 'model_4' }] },
      ],
      models: [
        { name: 'model_1', fields: [{ name: 'model_1_field_1', type: 'union_1' }] },
        { name: 'model_2', fields: [{ name: 'model_2_field_1', type: 'string' }] },
        { name: 'model_3', fields: [{ name: 'model_3_field_1', type: 'enum_1' }] },
        { name: 'model_4', fields: [{ name: 'model_4_field_1', type: 'string' }] },

        // Circular Dependency -- should not cause any infinite loops!
        { name: 'model_5', fields: [{ name: 'model_5_field_1', type: 'model_6' }] },
        { name: 'model_6', fields: [{ name: 'model_6_field_1', type: 'model_5' }] },

        // Complex types
        { name: 'model_7', fields: [{ name: 'model_7_field_1', type: '[enum_1]' }] },
        { name: 'model_8', fields: [{ name: 'model_8_field_1', type: 'map[string]' }] },
      ],
    },
  };

  const service = new Service(apiDefinition);

  it('should generate prop type code from a simple model entity', () => {
    const entity = {
      id: 'io.flow.test.v0.model_2',
      name: 'model_2',
      type: 'model',
      entity: {
        name: 'model_2',
        fields: [
          {
            name: 'model_2_field_1',
            type: 'string',
          },
        ],
      },
    };

    const propTypeString = generateModelPropType(entity, service);

    expect(propTypeString).toEqual(loadFixture(__dirname, './fixtures/model-prop-type_1.js.fixture'));
  });

  it('should generate prop type code from a model entity with fields that are other entities', () => {
    const entity = {
      id: 'io.flow.test.v0.model_1',
      name: 'model_1',
      type: 'model',
      entity: {
        name: 'model_1',
        fields: [
          {
            name: 'model_1_field_1',
            type: 'union_1',
          },
        ],
      },
    };

    const propTypeString = generateModelPropType(entity, service);

    expect(propTypeString).toEqual(loadFixture(__dirname, './fixtures/model-prop-type_2.js.fixture'));
  });

  it('should generate prop type code from a model entity with fields of type array', () => {
    const entity = {
      id: 'io.flow.test.v0.model_7',
      name: 'model_7',
      type: 'model',
      entity: {
        name: 'model_7',
        fields: [
          {
            name: 'model_7_field_1',
            type: '[enum_1]',
          },
        ],
      },
    };

    const propTypeString = generateModelPropType(entity, service);

    expect(propTypeString).toEqual(loadFixture(__dirname, './fixtures/model-prop-type_3.js.fixture'));
  });

  it('should generate prop type code from a model entity with fields of type map', () => {
    const entity = {
      id: 'io.flow.test.v0.model_8',
      name: 'model_8',
      type: 'model',
      entity: {
        name: 'model_8',
        fields: [
          {
            name: 'model_8_field_1',
            type: 'map[string]',
          },
        ],
      },
    };

    const propTypeString = generateModelPropType(entity, service);

    expect(propTypeString).toEqual(loadFixture(__dirname, './fixtures/model-prop-type_4.js.fixture'));
  });
});
