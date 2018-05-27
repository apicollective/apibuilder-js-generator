const get = require('lodash/get');
const Entity = require('./Entity');

class ApiBuilderField {
  constructor(schema, service) {
    Object.defineProperties(this, {
      name: {
        enumerable: true,
        value: schema.name,
      },
      type: {
        enumerable: true,
        get: () => Entity.fromType(schema.type, service),
      },
      description: {
        enumerable: true,
        value: schema.description,
      },
      isRequired: {
        enumerable: true,
        value: schema.required,
      },
      default: {
        enumerable: true,
        value: schema.default,
      },
      example: {
        enumerable: true,
        value: schema.example,
      },
      minimum: {
        enumerable: true,
        value: schema.minimum,
      },
      maximum: {
        enumerable: true,
        value: schema.maximum,
      },
      attributes: {
        enumerable: true,
        value: schema.attributes,
      },
      deprecationReason: {
        enumerable: true,
        value: get(schema, 'deprecation.description'),
      },
    });
  }
}

/**
 * Returns the ApiBuilderField corresponding to the specified API builder field definition.
 * @param {Object} schema
 * @param {ApiBuilderService} service
 */
ApiBuilderField.fromSchema = function fromSchema(schema, service) {
  return new ApiBuilderField(schema, service);
};

module.exports = ApiBuilderField;
