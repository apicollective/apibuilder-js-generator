const { ApiBuilderService, astFromTypeName, typeFromAst } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toGraphQLScalarType = require('../../../../../src/generators/node_graphql/utilities/toGraphQLScalarType');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toGraphQLScalarType', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('boolean'), service))).toEqual('GraphQLBoolean');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('date-iso8601'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('date-time-iso8601'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('decimal'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('double'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('integer'), service))).toEqual('GraphQLInt');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('json'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('long'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('object'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('string'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('unit'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('uuid'), service))).toEqual('GraphQLID');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual(undefined);
  });
});
