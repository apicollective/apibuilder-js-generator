import { findEntityByName, findEntityById, findEntity } from '../find-entity';

describe('entities > findEntity', () => {
  it('should find an entity by its name', () => {
    const entities = [
      { id: 'io.flow.test.v0.model_1', name: 'model_1' },
      { id: 'io.flow.test.v0.model_2', name: 'model_2' },
    ];

    expect(findEntityByName('model_1', entities)).toEqual(entities[0]);
    expect(findEntityByName('io.flow.test.v0.model_2', entities)).toBeUndefined();
    expect(findEntityByName('bogus', entities)).toBeUndefined();
  });

  it('should find an entity by its id', () => {
    const entities = [
      { id: 'io.flow.test.v0.model_1', name: 'model_1' },
      { id: 'io.flow.test.v0.model_2', name: 'model_2' },
    ];

    expect(findEntityById('io.flow.test.v0.model_1', entities)).toEqual(entities[0]);
    expect(findEntityById('model_2', entities)).toBeUndefined();
    expect(findEntityById('bogus', entities)).toBeUndefined();
  });

  it('should find an entity by either an id or name', () => {
    const entities = [
      { id: 'io.flow.test.v0.model_1', name: 'model_1' },
      { id: 'io.flow.test.v0.model_2', name: 'model_2' },
    ];

    expect(findEntity('io.flow.test.v0.model_1', entities)).toEqual(entities[0]);
    expect(findEntity('model_2', entities)).toEqual(entities[1]);
    expect(findEntity('bogus', entities)).toBeUndefined();
  });
});
