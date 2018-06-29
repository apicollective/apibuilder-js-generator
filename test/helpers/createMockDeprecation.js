const faker = require('faker');
const get = require('lodash/get');

function createMockDescription(config) {
  return {
    description: get(config, 'description', faker.lorem.sentence()),
  };
}

module.exports = createMockDescription;
