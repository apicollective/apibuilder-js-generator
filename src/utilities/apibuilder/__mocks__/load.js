const Service = require('../Service');

function mockLoad(options = {}) {
  return Promise.resolve(new Service({
    service: {
      organization: {
        key: options.organization,
      },
      application: {
        key: options.service,
      },
      imports: [],
      enums: [],
      models: [],
      unions: [],
    },
  }));
}

module.exports = mockLoad;
