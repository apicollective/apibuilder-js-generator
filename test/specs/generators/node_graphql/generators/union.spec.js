const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const generateUnion = require('../../../../../src/generators/node_graphql/generators/union');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate GraphQLUnionType from ApiBuilderUnion', () => {
  const union = service.findUnionByName('diff');
  expect(generateUnion(union)).toEqual(loadFixture('./generated/node_graphql/diff'));
});
