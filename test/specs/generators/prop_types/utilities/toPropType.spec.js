const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const astFromType = require('../../../../../src/utilities/apibuilder/astFromType');
const toPropTypes = require('../../../../../src/generators/prop_types/utilities/toPropTypes');
const typeFromAst = require('../../../../../src/utilities/apibuilder/typeFromAst');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toPropTypes', () => {
  test('should convert from apibuilder types to prop types', () => {
    // Primitive types
    expect(toPropTypes(typeFromAst(astFromType('string'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromType('date-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromType('date-time-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromType('uuid'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromType('boolean'), service))).toEqual('PropTypes.bool');
    expect(toPropTypes(typeFromAst(astFromType('decimal'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromType('double'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromType('integer'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromType('long'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromType('object'), service))).toEqual('PropTypes.object');
    expect(toPropTypes(typeFromAst(astFromType('json'), service))).toEqual('PropTypes.any');
    // Nested primitive types
    expect(toPropTypes(typeFromAst(astFromType('[string]'), service))).toEqual('PropTypes.arrayOf(PropTypes.string)');
    expect(toPropTypes(typeFromAst(astFromType('map[string]'), service))).toEqual('PropTypes.objectOf(PropTypes.string)');
    expect(toPropTypes(typeFromAst(astFromType('[map[string]]'), service))).toEqual('PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))');
    expect(toPropTypes(typeFromAst(astFromType('map[[string]]'), service))).toEqual('PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))');
    // Ridiculously nested primitive types (You would probably be fired for this).
    expect(toPropTypes(typeFromAst(astFromType('map[map[[[string]]]]'), service))).toEqual('PropTypes.objectOf(PropTypes.objectOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))))');
    // Internal enumeration
    expect(toPropTypes(typeFromAst(astFromType('visibility'), service))).toEqual('PropTypes.oneOf(visibilityPropTypes)');
    // External enumeration
    expect(toPropTypes(typeFromAst(astFromType('com.bryzek.apidoc.spec.v0.enums.method'), service))).toEqual('PropTypes.oneOf(methodPropTypes)');
    // Internal model
    expect(toPropTypes(typeFromAst(astFromType('application'), service))).toEqual('PropTypes.shape(applicationPropTypes)');
    // External model
    expect(toPropTypes(typeFromAst(astFromType('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual('PropTypes.shape(referencePropTypes)');
    // Internal union
    expect(toPropTypes(typeFromAst(astFromType('item_detail'), service))).toEqual('PropTypes.oneOfType(itemDetailPropTypes)');
    // External union
    expect(toPropTypes(typeFromAst(astFromType('com.bryzek.apidoc.spec.v0.unions.response_code'), service))).toEqual('PropTypes.oneOfType(responseCodePropTypes)');
    // Nested enumeration
    expect(toPropTypes(typeFromAst(astFromType('[visibility]'), service))).toEqual('PropTypes.arrayOf(PropTypes.oneOf(visibilityPropTypes))');
    expect(toPropTypes(typeFromAst(astFromType('map[visibility]'), service))).toEqual('PropTypes.objectOf(PropTypes.oneOf(visibilityPropTypes))');
    // Nested model
    expect(toPropTypes(typeFromAst(astFromType('[application]'), service))).toEqual('PropTypes.arrayOf(PropTypes.shape(applicationPropTypes))');
    expect(toPropTypes(typeFromAst(astFromType('map[application]'), service))).toEqual('PropTypes.objectOf(PropTypes.shape(applicationPropTypes))');
    // Nested union
    expect(toPropTypes(typeFromAst(astFromType('[item_detail]'), service))).toEqual('PropTypes.arrayOf(PropTypes.oneOfType(itemDetailPropTypes))');
    expect(toPropTypes(typeFromAst(astFromType('map[item_detail]'), service))).toEqual('PropTypes.objectOf(PropTypes.oneOfType(itemDetailPropTypes))');
  });

  test('should convert required apibuilder types to prop types', () => {
    expect(toPropTypes(typeFromAst(astFromType('string'), service), true)).toEqual('PropTypes.string.isRequired');
    expect(toPropTypes(typeFromAst(astFromType('[string]'), service), true)).toEqual('PropTypes.arrayOf(PropTypes.string).isRequired');
    expect(toPropTypes(typeFromAst(astFromType('[[string]]'), service), true)).toEqual('PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired');
    expect(toPropTypes(typeFromAst(astFromType('map[string]'), service), true)).toEqual('PropTypes.objectOf(PropTypes.string).isRequired');
    expect(toPropTypes(typeFromAst(astFromType('map[[string]]'), service), true)).toEqual('PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired');
  });

  test('should throw when type is not available in service', () => {
    expect(() => toPropTypes(typeFromAst(astFromType('triceratops'), service))).toThrow();
  });
});
