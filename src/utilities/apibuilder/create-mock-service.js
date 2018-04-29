const defaultService = {
  name: 'mockService',
  organization: {
    key: 'flow',
  },
  namespace: 'io.flow.v0',
  enums: [
    { name: 'enum_1' },
    { name: 'enum_2' },
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
};

function createMockService(props) {
  return { ...defaultService, ...props };
}

module.exports = createMockService;
