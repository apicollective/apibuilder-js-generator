const Entity = require('../../../../../src/utilities/apibuilder/Entity');
const Service = require('../../../../../src/utilities/apibuilder/Service');
const toPrimitivePropTypes = require('../../../../../src/generators/prop_types/utilities/toPrimitivePropTypes');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new Service({ service: schema });

describe('toPrimitivePropTypes', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toPrimitivePropTypes(Entity.fromType('string', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(Entity.fromType('date-iso8601', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(Entity.fromType('date-time-iso8601', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(Entity.fromType('uuid', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(Entity.fromType('boolean', service))).toEqual('PropTypes.bool');
    expect(toPrimitivePropTypes(Entity.fromType('decimal', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(Entity.fromType('double', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(Entity.fromType('integer', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(Entity.fromType('long', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(Entity.fromType('object', service))).toEqual('PropTypes.object');
    expect(toPrimitivePropTypes(Entity.fromType('json', service))).toEqual('PropTypes.any');
    expect(toPrimitivePropTypes(Entity.fromType('com.bryzek.apidoc.common.v0.models.reference', service))).toEqual('PropTypes.any');
  });
});
