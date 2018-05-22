const Entity = require('./Entity');
const FullyQualifiedType = require('./FullyQualifiedType');

class Field extends Entity {
  constructor(schema, fullyQualifiedType, service) {
    super(fullyQualifiedType, service);

    Object.defineProperty(this, 'schema', {
      enumerable: true,
      value: schema,
    });
  }
}

/**
 * Returns the Field corresponding to the specified API builder field definition.
 * @param {Object} schema
 * @param {Service} service
 */
Field.fromSchema = function fromSchema(schema, service) {
  const entity = Entity.fromType(schema.type, service);
  const fullyQualifiedType = new FullyQualifiedType(entity.fullyQualifiedType);
  return new Field(schema, fullyQualifiedType, service);
};

module.exports = Field;
