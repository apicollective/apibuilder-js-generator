const find = require('lodash/find');

const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const generateUnion = require('../../../../../src/generators/prop_types/generators/generator-union');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate prop types for union types', () => {
  const union = find(service.unions, { shortName: 'diff' });
  expect(generateUnion(union)).toEqual(loadFixture('./generated/prop_types/diff'));
});
