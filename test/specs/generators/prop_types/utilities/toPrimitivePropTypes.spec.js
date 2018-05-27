const ApiBuilderType = require('../../../../../src/utilities/apibuilder/ApiBuilderType');
const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const toPrimitivePropTypes = require('../../../../../src/generators/prop_types/utilities/toPrimitivePropTypes');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toPrimitivePropTypes', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('string', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('date-iso8601', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('date-time-iso8601', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('uuid', service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('boolean', service))).toEqual('PropTypes.bool');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('decimal', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('double', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('integer', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('long', service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('object', service))).toEqual('PropTypes.object');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('json', service))).toEqual('PropTypes.any');
    expect(toPrimitivePropTypes(ApiBuilderType.fromType('com.bryzek.apidoc.common.v0.models.reference', service))).toEqual('PropTypes.any');
  });
});
