const find = require('lodash/find');

const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const generateEnumeration = require('../../../../../src/generators/prop_types/generators/generator-enumeration');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate prop types for enum types', () => {
  const enumeration = find(service.enums, { shortName: 'publication' });
  expect(generateEnumeration(enumeration)).toEqual(loadFixture('./generated/prop_types/publication'));
});
