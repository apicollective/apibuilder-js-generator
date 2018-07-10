const { ApiBuilderService, astFromTypeName, typeFromAst } = require('../../../../../src/utilities/apibuilder');
const toPropTypes = require('../../../../../src/generators/prop_types/utilities/toPropTypes');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toPropTypes', () => {
  test('should convert from apibuilder types to prop types', () => {
    // Primitive types
    expect(toPropTypes(typeFromAst(astFromTypeName('string'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromTypeName('date-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromTypeName('date-time-iso8601'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromTypeName('uuid'), service))).toEqual('PropTypes.string');
    expect(toPropTypes(typeFromAst(astFromTypeName('boolean'), service))).toEqual('PropTypes.bool');
    expect(toPropTypes(typeFromAst(astFromTypeName('decimal'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromTypeName('double'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromTypeName('integer'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromTypeName('long'), service))).toEqual('PropTypes.number');
    expect(toPropTypes(typeFromAst(astFromTypeName('object'), service))).toEqual('PropTypes.object');
    expect(toPropTypes(typeFromAst(astFromTypeName('json'), service))).toEqual('PropTypes.any');
    // Nested primitive types
    expect(toPropTypes(typeFromAst(astFromTypeName('[string]'), service))).toEqual('PropTypes.arrayOf(PropTypes.string)');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[string]'), service))).toEqual('PropTypes.objectOf(PropTypes.string)');
    expect(toPropTypes(typeFromAst(astFromTypeName('[map[string]]'), service))).toEqual('PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[[string]]'), service))).toEqual('PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))');
    // Ridiculously nested primitive types (You would probably be fired for this).
    expect(toPropTypes(typeFromAst(astFromTypeName('map[map[[[string]]]]'), service))).toEqual('PropTypes.objectOf(PropTypes.objectOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))))');
    // Internal enumeration
    expect(toPropTypes(typeFromAst(astFromTypeName('visibility'), service))).toEqual('Visibility');
    // External enumeration
    expect(toPropTypes(typeFromAst(astFromTypeName('com.bryzek.apidoc.spec.v0.enums.method'), service))).toEqual('Method');
    // Internal model
    expect(toPropTypes(typeFromAst(astFromTypeName('application'), service))).toEqual('Application');
    // External model
    expect(toPropTypes(typeFromAst(astFromTypeName('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual('Reference');
    // Internal union
    expect(toPropTypes(typeFromAst(astFromTypeName('item_detail'), service))).toEqual('ItemDetail');
    // External union
    expect(toPropTypes(typeFromAst(astFromTypeName('com.bryzek.apidoc.spec.v0.unions.response_code'), service))).toEqual('ResponseCode');
    // Nested enumeration
    expect(toPropTypes(typeFromAst(astFromTypeName('[visibility]'), service))).toEqual('PropTypes.arrayOf(Visibility)');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[visibility]'), service))).toEqual('PropTypes.objectOf(Visibility)');
    // Nested model
    expect(toPropTypes(typeFromAst(astFromTypeName('[application]'), service))).toEqual('PropTypes.arrayOf(Application)');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[application]'), service))).toEqual('PropTypes.objectOf(Application)');
    // Nested union
    expect(toPropTypes(typeFromAst(astFromTypeName('[item_detail]'), service))).toEqual('PropTypes.arrayOf(ItemDetail)');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[item_detail]'), service))).toEqual('PropTypes.objectOf(ItemDetail)');
  });

  test('should convert required apibuilder types to prop types', () => {
    expect(toPropTypes(typeFromAst(astFromTypeName('string'), service), true)).toEqual('PropTypes.string.isRequired');
    expect(toPropTypes(typeFromAst(astFromTypeName('[string]'), service), true)).toEqual('PropTypes.arrayOf(PropTypes.string).isRequired');
    expect(toPropTypes(typeFromAst(astFromTypeName('[[string]]'), service), true)).toEqual('PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[string]'), service), true)).toEqual('PropTypes.objectOf(PropTypes.string).isRequired');
    expect(toPropTypes(typeFromAst(astFromTypeName('map[[string]]'), service), true)).toEqual('PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired');
  });

  test('should throw when type is not available in service', () => {
    expect(() => toPropTypes(typeFromAst(astFromTypeName('triceratops'), service))).toThrow();
  });
});
