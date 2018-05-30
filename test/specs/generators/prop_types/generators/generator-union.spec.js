const find = require('lodash/find');

const loadFixture = require('../../../../helpers/loadFixture');
const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const generateUnion = require('../../../../../src/generators/prop_types/generators/generator-union');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate prop types for union types', () => {
  const union = find(service.unions, { shortName: 'diff' });
  expect(generateUnion(union)).toEqual(loadFixture(__dirname, '../../../../fixtures/generated/prop_types/diff'));
});
