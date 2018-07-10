const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const generateUnion = require('../../../../../src/generators/prop_types/generators/generator-union');
const apidocSchema = require('../../../../fixtures/schemas/apidoc-api.json');
const peopleSchema = require('../../../../fixtures/schemas/people-api.json');

const apidocService = new ApiBuilderService({ service: apidocSchema });
const peopleService = new ApiBuilderService({ service: peopleSchema });

test('should generate prop types for union types', () => {
  const union = apidocService.findUnionByName('diff');
  expect(generateUnion(union)).toEqual(loadFixture('./generated/prop_types/diff'));
});

test('should generate prop types for union types with cyclic dependencies', () => {
  const union = peopleService.findUnionByName('funder');
  expect(generateUnion(union)).toEqual(loadFixture('./generated/prop_types/funder'));
});
