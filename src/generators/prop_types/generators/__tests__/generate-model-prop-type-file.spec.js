import Service from '../../../../utilities/apibuilder/Service';

import generateModelPropTypeFile from '../generate-model-prop-type-file';
import loadFixture from '../../../../../test/utilities/load-fixture';

describe('generateModelPropTypeFile', () => {
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
      ],
    },
  };

  const service = new Service(apiDefinition);

  it('should return a GenerateFile containing the path and file contents for the prop type (with sub entities)', () => {
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

    const generatedFile = generateModelPropTypeFile(entity, service);

    expect(generatedFile.path).toEqual('model/model-1.js');
    expect(generatedFile.contents).toEqual(loadFixture(__dirname, './fixtures/model-prop-type-file-sub-entities.js.fixture'));
  });

  it('should return a GenerateFile containing the path and file contents for the prop type (with no entities)', () => {
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

    const generatedFile = generateModelPropTypeFile(entity, service);

    expect(generatedFile.path).toEqual('model/model-2.js');
    expect(generatedFile.contents).toEqual(loadFixture(__dirname, './fixtures/model-prop-type-file-no-entities.js.fixture'));
  });
});
