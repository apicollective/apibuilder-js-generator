import toCustomScalarType from '../../../../../src/generators/node_graphql/utilities/toCustomScalarType';
import toGraphQLScalarType from '../../../../../src/generators/node_graphql/utilities/toGraphQLScalarType';
import { ApiBuilderService, astFromTypeName, typeFromAst } from '../../../../../src/utilities/apibuilder';
import apidocApiJson from '../../../../fixtures/schemas/apidoc-api.json';

// IMPORTANT: Tests use types that are part of this schema definition.
// By the way, this is the schema definition for apibuilder api:
// https://app.apibuilder.io/bryzek/apidoc-api/latest
const service = new ApiBuilderService({ service: apidocApiJson });

describe('toGraphQLScalarType', () => {
  it('should convert from apibuilder types to built-in GraphQL types', () => {
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('boolean'), service))).toEqual('GraphQLBoolean');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('date-iso8601'), service)))
      .toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('date-time-iso8601'), service)))
      .toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('decimal'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('double'), service))).toEqual('GraphQLFloat');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('integer'), service))).toEqual('GraphQLInt');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('json'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('long'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('object'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('string'), service))).toEqual('GraphQLString');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('unit'), service))).toEqual(undefined);
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('uuid'), service))).toEqual('GraphQLID');
    expect(toGraphQLScalarType(typeFromAst(astFromTypeName('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual(undefined);
  });

  it('should convert from apibuilder types to custom scalars', () => {
    expect(toCustomScalarType(typeFromAst(astFromTypeName('boolean'), service))).toEqual(undefined);
    expect(toCustomScalarType(typeFromAst(astFromTypeName('date-iso8601'), service))).toEqual('GraphQLDate');
    expect(toCustomScalarType(typeFromAst(astFromTypeName('date-time-iso8601'), service))).toEqual('GraphQLDateTime');
    expect(toCustomScalarType(typeFromAst(astFromTypeName('decimal'), service))).toEqual(undefined);
    expect(toCustomScalarType(typeFromAst(astFromTypeName('double'), service))).toEqual(undefined);
    expect(toCustomScalarType(typeFromAst(astFromTypeName('integer'), service))).toEqual(undefined);
    expect(toCustomScalarType(typeFromAst(astFromTypeName('json'), service))).toEqual('ApiBuilderJson');
    expect(toCustomScalarType(typeFromAst(astFromTypeName('long'), service))).toEqual('ApiBuilderLong');
    expect(toCustomScalarType(typeFromAst(astFromTypeName('object'), service))).toEqual('ApiBuilderObject');
    expect(toCustomScalarType(typeFromAst(astFromTypeName('string'), service))).toEqual(undefined);
    expect(toCustomScalarType(typeFromAst(astFromTypeName('unit'), service))).toEqual('ApiBuilderUnit');
    expect(toCustomScalarType(typeFromAst(astFromTypeName('uuid'), service))).toEqual(undefined);
    expect(toCustomScalarType(typeFromAst(astFromTypeName('com.bryzek.apidoc.common.v0.models.reference'), service))).toEqual(undefined);
  });
});
