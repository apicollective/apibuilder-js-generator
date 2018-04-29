import getIndexedEntity from '../get-indexed-entity';
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

  it('should return an index of entities for a specific model', () => {
    const expected = ['model_1', 'union_1', 'model_3', 'enum_1', 'model_4'];
    const entities = getIndexedEntities(mockService);
    const result = getIndexedEntity('model_1', entities).map(e => e.name);
    expect(result).toEqual(expected);
  });

  it('should return an index of entities for a specific model -- with circular dependency', () => {
    const expected = ['model_5', 'model_6'];
    const entities = getIndexedEntities(mockService);
    const result = getIndexedEntity('model_5', entities).map(e => e.name);
    expect(result).toEqual(expected);
  });
});
