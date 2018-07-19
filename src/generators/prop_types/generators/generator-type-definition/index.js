const camelCase = require('lodash/camelCase');
const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');

function shortNameCompare(a, b) {
  if (a.shortName > b.shortName) return 1;
  if (a.shortName < b.shortName) return -1;
  return 0;
}

function generate(service) {
  const identifierNames = service.internalTypes
    .sort(shortNameCompare)
    .map(type => camelCase(type.shortName));
  const templatePath = path.resolve(__dirname, './templates/type-definition.ejs');
  return renderTemplate(templatePath, {
    applicationKey: service.applicationKey,
    identifierNames,
    organizationKey: service.organizationKey,
    versionNumber: service.version,
  }, { prettier: false });
}

module.exports = generate;
