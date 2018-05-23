const find = require('lodash/find');

const loadFixture = require('../../../../helpers/loadFixture');
const Service = require('../../../../../src/utilities/apibuilder/Service');
const generateEnumeration = require('../../../../../src/generators/node_graphql/generators/enumeration');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });

test('should generate graphql enumeration from apibuilder enumeration', () => {
  const enumeration = find(service.enums, { shortName: 'publication' });
  expect(generateEnumeration(enumeration)).toEqual(loadFixture(__dirname, '../../../../fixtures/generated/node_graphql/publication'));
});
