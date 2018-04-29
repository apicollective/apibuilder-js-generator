import Service from '../../../../utilities/apibuilder/Service';

import generatePropTypeFile from '../generate-prop-type-file';

describe('generatePropTypeFile', () => {
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

  it('should return a Generated File for an enum entity', () => {
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

    const generatedFile = generatePropTypeFile(service, entity);

    expect(generatedFile.path).toEqual('enum/enum-1.js');
    expect(generatedFile.contents.length).toBeGreaterThan(0);
  });

  it('should return a Generated File for a model entity', () => {
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

    const generatedFile = generatePropTypeFile(service, entity);

    expect(generatedFile.path).toEqual('model/model-1.js');
    expect(generatedFile.contents.length).toBeGreaterThan(0);
  });

  it('should return a Generated File for a union entity', () => {
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

    const generatedFile = generatePropTypeFile(service, entity);

    expect(generatedFile.path).toEqual('union/union-1.js');
    expect(generatedFile.contents.length).toBeGreaterThan(0);
  });

  it('should throw an error with an unsupported entity type', () => {
    const entity = {
      id: 'io.flow.test.v0.foo_1',
      name: 'foo_1',
      type: 'foo',
      entity: {},
    };

    expect(() => generatePropTypeFile(service, entity)).toThrow();
  });
});
