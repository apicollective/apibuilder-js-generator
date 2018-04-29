import getIndexedEntities from '../get-indexed-entities';
import createMockService from '../../create-mock-service';

describe('entities > getEntities', () => {
  const mockService = createMockService({
    name: 'newService',
    organization: {
      key: 'flow',
    },
    namespace: 'io.flow.v0',
    version: '0.3.65',
  });

  it('should return an index of entities', () => {
    const expected = [
      {
        id: 'io.flow.v0.enums.enum_1', type: 'enum', name: 'enum_1', entity: mockService.enums[0],
      },
      {
        id: 'io.flow.v0.enums.enum_2', type: 'enum', name: 'enum_2', entity: mockService.enums[1],
      },
      {
        id: 'io.flow.v0.unions.union_1', type: 'union', name: 'union_1', entity: mockService.unions[0],
      },
      {
        id: 'io.flow.v0.models.model_1', type: 'model', name: 'model_1', entity: mockService.models[0],
      },
      {
        id: 'io.flow.v0.models.model_2', type: 'model', name: 'model_2', entity: mockService.models[1],
      },
      {
        id: 'io.flow.v0.models.model_3', type: 'model', name: 'model_3', entity: mockService.models[2],
      },
      {
        id: 'io.flow.v0.models.model_4', type: 'model', name: 'model_4', entity: mockService.models[3],
      },
      {
        id: 'io.flow.v0.models.model_5', type: 'model', name: 'model_5', entity: mockService.models[4],
      },
      {
        id: 'io.flow.v0.models.model_6', type: 'model', name: 'model_6', entity: mockService.models[5],
      },
    ];

    expect(getIndexedEntities(mockService)).toEqual(expected);
  });
});
