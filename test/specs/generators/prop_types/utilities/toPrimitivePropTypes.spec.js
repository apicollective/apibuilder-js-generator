const { ApiBuilderService, astFromTypeName, typeFromAst } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toPrimitivePropTypes = require('../../../../../src/generators/prop_types/utilities/toPrimitivePropTypes');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toPrimitivePropTypes', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('string'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('date-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('date-time-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('uuid'), service))).toEqual('PropTypes.string');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('boolean'), service))).toEqual('PropTypes.bool');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('decimal'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('double'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('integer'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('long'), service))).toEqual('PropTypes.number');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('object'), service))).toEqual('PropTypes.object');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('json'), service))).toEqual('PropTypes.any');
    expect(toPrimitivePropTypes(typeFromAst(astFromTypeName('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual('PropTypes.any');
  });
});
