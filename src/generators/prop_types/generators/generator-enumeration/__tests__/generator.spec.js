const find = require('lodash/find');
const matchesProperty = require('lodash/matchesProperty');

const Service = require('../../../../../utilities/apibuilder/Service');
const generateEnumeration = require('../../generator-enumeration');
const loadFixture = require('../../../../../../test/utilities/loadFixture');
const schema = require('../../../../../../test/fixtures/schemas/apidoc-api.json');

test('generates file content corresponding to specified enumeration', () => {
  const service = new Service({ service: schema });
  const enumeration = find(service.enumerations, matchesProperty('schema.name', 'visibility'));
  const expectedContent = loadFixture(__dirname, './fixtures/visibility');
  expect(generateEnumeration(enumeration, service)).toEqual(expectedContent);
});
