const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const { generateFile } = require('../../../../../src/generators/node_graphql/generators/model');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate GraphQL object type from API builder model', () => {
  const model = service.findModelByName('application');
  const file = generateFile(model);
  expect(file.name).toEqual('Application.js');
  expect(file.dir).toEqual('types/com/bryzek/apidoc/api/v0/models');
  expect(file.contents).toEqual(loadFixture('./generated/node_graphql/application'));
});
