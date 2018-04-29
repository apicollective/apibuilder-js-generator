import Service from '../../../../utilities/apibuilder/Service';

import getGeneratedSubEntities from '../get-generated-sub-entities';
import loadFixture from '../../../../../test/utilities/load-fixture';

describe('getGeneratedSubEntities', () => {
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

  it('should get sub entities for an entity in a service', () => {
    const entityWithSubs = { name: 'model_1', fields: [{ name: 'model_1_field_1', type: 'union_1' }] };
    const subEntities = getGeneratedSubEntities(entityWithSubs, service);
    expect(subEntities.trim()).toEqual(loadFixture(__dirname, './fixtures/get-generated-sub-entities.js.fixture'));
  });

  it('should return an empty string for an entity with no sub entities', () => {
    const entityWithNoSubs = { name: 'model_2', fields: [{ name: 'model_2_field_1', type: 'string' }] };
    const subEntities = getGeneratedSubEntities(entityWithNoSubs, service);
    expect(subEntities.trim()).toEqual('');
  });
});
