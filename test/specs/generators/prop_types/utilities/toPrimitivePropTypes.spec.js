const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const astFromType = require('../../../../../src/utilities/apibuilder/astFromType');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toPrimitivePropTypes = require('../../../../../src/generators/prop_types/utilities/toPrimitivePropTypes');
const typeFromAst = require('../../../../../src/utilities/apibuilder/typeFromAst');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toPrimitivePropTypes', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toPrimitivePropTypes(typeFromAst(astFromType('string'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('date-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('date-time-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('uuid'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('boolean'), service))).toEqual('PropTypes.bool');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('decimal'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('double'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('integer'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('long'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('object'), service))).toEqual('PropTypes.object');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('json'), service))).toEqual('PropTypes.any');
    expect(toPrimitivePropTypes(typeFromAst(astFromType('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual('PropTypes.any');
  });
});
