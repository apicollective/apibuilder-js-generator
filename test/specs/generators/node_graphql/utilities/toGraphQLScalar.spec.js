const Entity = require('../../../../../src/utilities/apibuilder/Entity');
const PrimitiveType = require('../../../../../src/utilities/apibuilder/PrimitiveType');
const Service = require('../../../../../src/utilities/apibuilder/Service');

const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toGraphQLScalarType = require('../../../../../src/generators/node_graphql/utilities/toGraphQLScalarType');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new Service({ service: schema });

describe('toGraphQLScalarType', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.BOOLEAN, service))).toEqual('GraphQLBoolean');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.DATE_ISO8601, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.DATE_TIME_ISO8601, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.DECIMAL, service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.DOUBLE, service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.INTEGER, service))).toEqual('GraphQLInt');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.JSON, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.LONG, service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.OBJECT, service))).toEqual(undefined);
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.STRING, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.UNIT, service))).toEqual(undefined);
    expect(toGraphQLScalarType(Entity.fromType(PrimitiveType.UUID, service))).toEqual('GraphQLID');
    expect(toGraphQLScalarType(Entity.fromType('com.bryzek.apidoc.common.v0.models.reference', service))).toEqual(undefined);
  });
});
