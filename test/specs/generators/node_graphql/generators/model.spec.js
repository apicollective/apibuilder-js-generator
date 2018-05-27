const find = require('lodash/find');

const loadFixture = require('../../../../helpers/loadFixture');
const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const generateModel = require('../../../../../src/generators/node_graphql/generators/model');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate GraphQL output type for model', () => {
  const model = find(service.models, { shortName: 'application' });
  expect(generateModel(model)).toEqual(loadFixture(__dirname, '../../../../fixtures/generated/node_graphql/application'));
});
