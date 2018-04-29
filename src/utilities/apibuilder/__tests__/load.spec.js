import nock from 'nock';

import load from '../load';

describe('load', () => {
  const organization = 'flow';
  const version = 'latest';

  it('should load an api from public remote url', () => {
    const service = 'api';

    nock('https://api.apibuilder.io')
      .get(`/${organization}/${service}/${version}`)
      .reply(200, { service: { name: 'API' } }, {
        'Content-Type': 'application/json',
      });

    return load({
      organization,
      service,
    }).then((serviceResponse) => {
      expect(serviceResponse.getName()).toBe('API');
    });
  });

  it('should load an api from private remote url', () => {
    const service = 'api-internal';

    nock('https://api.apibuilder.io')
      .get(`/${organization}/${service}/${version}`)
      .reply(200, { service: { name: 'API Internal' } }, {
        'Content-Type': 'application/json',
      });

    return load({
      organization,
      service,
      authToken: 'apibuilder-auth-token',
    }).then((serviceResponse) => {
      expect(serviceResponse.getName()).toBe('API Internal');
    });
  });
});
