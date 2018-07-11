const camelCase = require('lodash/camelCase');
const get = require('lodash/get');
const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');

function shortNameCompare(a, b) {
  if (a.shortName > b.shortName) return 1;
  if (a.shortName < b.shortName) return -1;
  return 0;
}

function generate(types, attributes) {
  const versionNumber = get(attributes, 'versionNumber');
  const libraryName = get(attributes, 'libraryName');
  const repository = get(attributes, 'repository');
  const identifierNames = types.sort(shortNameCompare).map(type => camelCase(type.shortName));
  const templatePath = path.resolve(__dirname, './templates/type-definition.ejs');
  return renderTemplate(templatePath, {
    versionNumber,
    libraryName,
    repository,
    identifierNames,
  }, { prettier: false });
}

module.exports = generate;
