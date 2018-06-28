const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const { generateFile } = require('../../../../../src/generators/node_graphql/generators/union');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate GraphQL union type from API Builder union', () => {
  const union = service.findUnionByName('diff');
  const file = generateFile(union);
  expect(file.name).toBe('Diff.js');
  expect(file.dir).toBe('com/bryzek/apidoc/api/v0/unions');
  expect(file.contents).toBe(loadFixture('./generated/node_graphql/diff'));
});
