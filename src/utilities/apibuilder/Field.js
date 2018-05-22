const Entity = require('./Entity');

class Field extends Entity {
  constructor(schema, fullyQualifiedType, service) {
    super(fullyQualifiedType, service);
    this.schema = schema;
  }
}

Field.fromSchema = function fromSchema(schema, service) {
  const entity = Entity.fromType(schema.type, service);
  return new Field(schema, entity.fullyQualifiedType, service);
};

module.exports = Field;
