const Service = require('../../../../utilities/apibuilder/Service');
const fetchServices = require('../fetch-services');

jest.mock('../../../../utilities/apibuilder/load');

describe('fetchServices', () => {
  it('should fetch services', () =>
    fetchServices(['some-api', 'another-api'], {
      envApiBuilderOrganization: 'fetch-services-test',
      envApiBuilderToken: 'Zxljasdljfaou3208jsojdasf',
    }).then((apis) => {
      apis.forEach((api) => {
        expect(api).toBeInstanceOf(Service);
      });
    }));
});
