const faker = require('faker');
const get = require('lodash/get');

function createMockEnumValue(config) {
  return {
    name: get(config, 'name', faker.lorem.word()),
    description: get(config, 'description'),
    deprecation: get(config, 'deprecation'),
    attributes: get(config, 'attributes', []),
  };
}

module.exports = createMockEnumValue;
