import Service from '../Service';
import createMockService from '../create-mock-service';

describe('Service', () => {
  const mockService = {
    service: createMockService({
      name: 'newService',
      organization: {
        key: 'flow',
      },
      namespace: 'io.flow.v0',
      version: '0.3.65',
    }),
  };
  it('should get basic properties', () => {
    const service = new Service(mockService);
    expect(service.getName()).toEqual('newService');
    expect(service.getOrganizationKey()).toEqual('flow');
    expect(service.getNamespace()).toEqual('io.flow.v0');
    expect(service.getVersion()).toEqual('0.3.65');
  });
});
