import {
  ApiBuilderPrimitiveType,
  Kind,
 } from 'apibuilder-js';

function convertApiBuilderPrimitiveType(type: ApiBuilderPrimitiveType) {
  switch (type.baseTypeName) {
    case Kind.BOOLEAN: return { type: 'boolean' };
    case Kind.DATE_ISO8601: return { type: 'string', format: 'date' };
    case Kind.DATE_TIME_ISO8601: return { type: 'string', format: 'date-time' };
    case Kind.DECIMAL: return { type: 'number', format: 'float' };
    case Kind.DOUBLE: return { type: 'number', format: 'double' };
    case Kind.INTEGER: return { type: 'integer' };
    case Kind.JSON: return {
      anyOf: [
        { type: 'boolean' },
        { type: 'object' },
        { type: 'number' },
        { type: 'array' },
        { type: 'string' },
      ],
    };
    case Kind.LONG: return { type: 'integer', format: 'int64' };
    case Kind.OBJECT: return { type: 'object' };
    case Kind.STRING: return { type: 'string' };
    case Kind.UNIT: return { type: 'integer', nullable: true };
    case Kind.UUID: return { type: 'string', format: 'uuid' };
  }
}

export default convertApiBuilderPrimitiveType;
