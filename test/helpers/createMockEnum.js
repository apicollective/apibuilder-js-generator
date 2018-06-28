const faker = require('faker');
const get = require('lodash/get');
const createMockEnumValue = require('./createMockEnumValue');

function createMockEnum(config) {
  return {
    name: get(config, 'name', faker.lorem.word()),
    plural: get(config, 'plural', faker.lorem.word()),
    description: get(config, 'description'),
    deprecation: get(config, 'deprecation'),
    values: get(config, 'values', [createMockEnumValue()]),
    attributes: get(config, 'attributes', []),
  };
}

module.exports = createMockEnum;
