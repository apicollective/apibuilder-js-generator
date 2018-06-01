const find = require('lodash/find');

const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const generateEnumeration = require('../../../../../src/generators/node_graphql/generators/enumeration');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate graphql enumeration from apibuilder enumeration', () => {
  const enumeration = find(service.enums, { shortName: 'publication' });
  expect(generateEnumeration(enumeration)).toEqual(loadFixture('./generated/node_graphql/publication'));
});
