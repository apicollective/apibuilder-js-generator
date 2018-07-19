const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const generateModel = require('../../../../../src/generators/prop_types/generators/generator-model');
const apidocSchema = require('../../../../fixtures/schemas/apidoc-api.json');
const peopleSchema = require('../../../../fixtures/schemas/people-api.json');

const apidocService = new ApiBuilderService({ service: apidocSchema });
const peopleService = new ApiBuilderService({ service: peopleSchema });

test('should generate prop types for model types', () => {
  const model = apidocService.findModelByName('application');
  expect(generateModel(model)).toEqual(loadFixture('./generated/prop_types/application'));
});

test('should generate prop types for models with cyclic dependencies', () => {
  const model = peopleService.findModelByName('organization');
  expect(generateModel(model)).toEqual(loadFixture('./generated/prop_types/organization'));
});
