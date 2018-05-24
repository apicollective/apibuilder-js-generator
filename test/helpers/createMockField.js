const faker = require('faker');
const get = require('lodash/get');
const sample = require('lodash/sample');
const values = require('lodash/values');

const PrimitiveType = require('../../src/utilities/apibuilder/PrimitiveType');

function createMockField(config) {
  return {
    name: get(config, 'name', faker.lorem.word()),
    type: get(config, 'type', sample(values(PrimitiveType))),
    description: get(config, 'description'),
    required: get(config, 'required', true),
    default: get(config, 'default'),
    example: get(config, 'example'),
    minimum: get(config, 'minimum'),
    maximum: get(config, 'maximum'),
    attributes: get(config, 'attributes'),
    deprecation: get(config, 'deprecation'),
  };
}

module.exports = createMockField;
