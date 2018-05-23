const Entity = require('../../../../../src/utilities/apibuilder/Entity');
const Service = require('../../../../../src/utilities/apibuilder/Service');
const toPropTypes = require('../../../../../src/generators/prop_types/utilities/toPropTypes');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new Service({ service: schema });

describe('toPropTypes', () => {
  test('should convert from apibuilder types to prop types', () => {
    // Primitive types
    expect(toPropTypes(Entity.fromType('string', service))).toEqual('PropTypes.string');
    expect(toPropTypes(Entity.fromType('date-iso8601', service))).toEqual('PropTypes.string');
    expect(toPropTypes(Entity.fromType('date-time-iso8601', service))).toEqual('PropTypes.string');
    expect(toPropTypes(Entity.fromType('uuid', service))).toEqual('PropTypes.string');
    expect(toPropTypes(Entity.fromType('boolean', service))).toEqual('PropTypes.bool');
    expect(toPropTypes(Entity.fromType('decimal', service))).toEqual('PropTypes.number');
    expect(toPropTypes(Entity.fromType('double', service))).toEqual('PropTypes.number');
    expect(toPropTypes(Entity.fromType('integer', service))).toEqual('PropTypes.number');
    expect(toPropTypes(Entity.fromType('long', service))).toEqual('PropTypes.number');
    expect(toPropTypes(Entity.fromType('object', service))).toEqual('PropTypes.object');
    expect(toPropTypes(Entity.fromType('json', service))).toEqual('PropTypes.any');
    // Nested primitive types
    expect(toPropTypes(Entity.fromType('[string]', service))).toEqual('PropTypes.arrayOf(PropTypes.string)');
    expect(toPropTypes(Entity.fromType('map[string]', service))).toEqual('PropTypes.objectOf(PropTypes.string)');
    expect(toPropTypes(Entity.fromType('[map[string]]', service))).toEqual('PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string))');
    expect(toPropTypes(Entity.fromType('map[[string]]', service))).toEqual('PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string))');
    // Ridiculously nested primitive types (You would probably be fired for this).
    expect(toPropTypes(Entity.fromType('map[map[[[string]]]]', service))).toEqual('PropTypes.objectOf(PropTypes.objectOf(PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string))))');
    // Internal enumeration
    expect(toPropTypes(Entity.fromType('visibility', service))).toEqual('PropTypes.oneOf(visibilityPropTypes)');
    // External enumeration
    expect(toPropTypes(Entity.fromType('com.bryzek.apidoc.spec.v0.enums.method', service))).toEqual('PropTypes.oneOf(methodPropTypes)');
    // Internal model
    expect(toPropTypes(Entity.fromType('application', service))).toEqual('PropTypes.shape(applicationPropTypes)');
    // External model
    expect(toPropTypes(Entity.fromType('com.bryzek.apidoc.common.v0.models.reference', service))).toEqual('PropTypes.shape(referencePropTypes)');
    // Internal union
    expect(toPropTypes(Entity.fromType('item_detail', service))).toEqual('PropTypes.oneOfType(itemDetailPropTypes)');
    // External union
    expect(toPropTypes(Entity.fromType('com.bryzek.apidoc.spec.v0.unions.response_code', service))).toEqual('PropTypes.oneOfType(responseCodePropTypes)');
    // Nested enumeration
    expect(toPropTypes(Entity.fromType('[visibility]', service))).toEqual('PropTypes.arrayOf(PropTypes.oneOf(visibilityPropTypes))');
    expect(toPropTypes(Entity.fromType('map[visibility]', service))).toEqual('PropTypes.objectOf(PropTypes.oneOf(visibilityPropTypes))');
    // Nested model
    expect(toPropTypes(Entity.fromType('[application]', service))).toEqual('PropTypes.arrayOf(PropTypes.shape(applicationPropTypes))');
    expect(toPropTypes(Entity.fromType('map[application]', service))).toEqual('PropTypes.objectOf(PropTypes.shape(applicationPropTypes))');
    // Nested union
    expect(toPropTypes(Entity.fromType('[item_detail]', service))).toEqual('PropTypes.arrayOf(PropTypes.oneOfType(itemDetailPropTypes))');
    expect(toPropTypes(Entity.fromType('map[item_detail]', service))).toEqual('PropTypes.objectOf(PropTypes.oneOfType(itemDetailPropTypes))');
  });

  test('should convert required apibuilder types to prop types', () => {
    expect(toPropTypes(Entity.fromType('string', service), true)).toEqual('PropTypes.string.isRequired');
    expect(toPropTypes(Entity.fromType('[string]', service), true)).toEqual('PropTypes.arrayOf(PropTypes.string).isRequired');
    expect(toPropTypes(Entity.fromType('[[string]]', service), true)).toEqual('PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired');
    expect(toPropTypes(Entity.fromType('map[string]', service), true)).toEqual('PropTypes.objectOf(PropTypes.string).isRequired');
    expect(toPropTypes(Entity.fromType('map[[string]]', service), true)).toEqual('PropTypes.objectOf(PropTypes.arrayOf(PropTypes.string)).isRequired');
  });

  test('should throw when type is not available in service', () => {
    expect(() => toPropTypes(Entity.fromType('triceratops', service))).toThrow();
  });
});
