/* eslint-disable max-len */

const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const astFromType = require('../../../../../src/utilities/apibuilder/astFromType');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toGraphQLScalarType = require('../../../../../src/generators/node_graphql/utilities/toGraphQLScalarType');
const typeFromAst = require('../../../../../src/utilities/apibuilder/typeFromAst');

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: schema });

describe('toGraphQLScalarType', () => {
  it('should convert from apibuilder types to prop types', () => {
    expect(toGraphQLScalarType(typeFromAst(astFromType('boolean'), service))).toEqual('GraphQLBoolean');
    expect(toGraphQLScalarType(typeFromAst(astFromType('date-iso8601'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromType('date-time-iso8601'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromType('decimal'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromType('double'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromType('integer'), service))).toEqual('GraphQLInt');
    expect(toGraphQLScalarType(typeFromAst(astFromType('json'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromType('long'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromType('object'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromType('string'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromType('unit'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromType('uuid'), service))).toEqual('GraphQLID');
    expect(toGraphQLScalarType(typeFromAst(astFromType('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual(undefined);
  });
});
