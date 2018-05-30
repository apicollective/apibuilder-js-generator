const faker = require('faker');
const get = require('lodash/get');

const TypeKind = require('../../src/utilities/apibuilder/TypeKind');

function createMockField(config) {
  return {
    name: get(config, 'name', faker.lorem.word()),
    type: get(config, 'type', TypeKind.STRING),
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
