const find = require('lodash/find');

const loadFixture = require('../../../../helpers/loadFixture');
const Service = require('../../../../../src/utilities/apibuilder/Service');
const generateModel = require('../../../../../src/generators/prop_types/generators/generator-model');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });

test('should generate prop types for model types', () => {
  const model = find(service.models, { shortName: 'application' });
  expect(generateModel(model)).toEqual(loadFixture(__dirname, '../../../../fixtures/generated/prop_types/application'));
});
