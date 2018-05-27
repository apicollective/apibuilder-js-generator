/* eslint-disable max-len */

const ApiBuilderType = require('../../../../../src/utilities/apibuilder/ApiBuilderType');
const PrimitiveType = require('../../../../../src/utilities/apibuilder/PrimitiveType');
const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');

const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toGraphQLScalarType = require('../../../../../src/generators/node_graphql/utilities/toGraphQLScalarType');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toGraphQLScalarType', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.BOOLEAN, service))).toEqual('GraphQLBoolean');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.DATE_ISO8601, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.DATE_TIME_ISO8601, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.DECIMAL, service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.DOUBLE, service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.INTEGER, service))).toEqual('GraphQLInt');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.JSON, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.LONG, service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.OBJECT, service))).toEqual(undefined);
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.STRING, service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.UNIT, service))).toEqual(undefined);
    expect(toGraphQLScalarType(ApiBuilderType.fromType(PrimitiveType.UUID, service))).toEqual('GraphQLID');
    expect(toGraphQLScalarType(ApiBuilderType.fromType('com.bryzek.apidoc.common.v0.models.reference', service))).toEqual(undefined);
  });
});
