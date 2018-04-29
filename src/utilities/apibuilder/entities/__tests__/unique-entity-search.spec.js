import UniqueEntitySearch from '../unique-entity-search';

describe('entities > UniqueEntitySearch', () => {
  it('should return an entity if it has not been searched before', () => {
    const entities = [
      { id: 'io.flow.test.v0.model_1', name: 'model_1' },
      { id: 'io.flow.test.v0.model_2', name: 'model_2' },
    ];
    const entitySearch = new UniqueEntitySearch(entities);

    expect(entitySearch.findUnique('model_1')).toEqual(entities[0]);
    expect(entitySearch.findUnique('model_1')).toBeUndefined();
    expect(entitySearch.findUnique('io.flow.test.v0.model_1')).toBeUndefined();
    expect(entitySearch.findUnique('io.flow.test.v0.model_2')).toEqual(entities[1]);
    expect(entitySearch.findUnique('model_2')).toBeUndefined();
  });
});
