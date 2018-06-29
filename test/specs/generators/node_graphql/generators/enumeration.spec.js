const find = require('lodash/find');

const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const { loadFixture } = require('../../../../helpers/loadFixture');
const { generateFile } = require('../../../../../src/generators/node_graphql/generators/enumeration');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

test('should generate graphql enumeration from apibuilder enumeration', () => {
  const enumeration = find(service.enums, { shortName: 'publication' });
  const file = generateFile(enumeration);
  expect(file.name).toEqual('Publication.js');
  expect(file.dir).toEqual('com/bryzek/apidoc/api/v0/enums');
  expect(file.contents).toEqual(loadFixture('./generated/node_graphql/publication'));
});
