const Entity = require('./Entity');

class Field {
  constructor(schema, service) {
    Object.defineProperty(this, 'schema', {
      enumerable: true,
      value: schema,
    });

    Object.defineProperty(this, 'name', {
      value: schema.name,
    });

    Object.defineProperty(this, 'isRequired', {
      value: schema.required,
    });

    Object.defineProperty(this, 'type', {
      get() {
        return Entity.fromType(schema.type, service);
      },
    });
  }
}

/**
 * Returns the Field corresponding to the specified API builder field definition.
 * @param {Object} schema
 * @param {Service} service
 */
Field.fromSchema = function fromSchema(schema, service) {
  return new Field(schema, service);
};

module.exports = Field;
