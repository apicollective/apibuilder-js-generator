import getEntities from '../get-entities';
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

  it('should return raw entities', () => {
    const { enums, unions, models } = mockService;
    expect(getEntities(mockService)).toEqual({ enums, unions, models });
  });
});
