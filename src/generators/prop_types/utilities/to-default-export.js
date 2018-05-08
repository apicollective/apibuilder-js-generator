const camelCase = require('lodash/camelCase');
const getRootType = require('../../../utilities/apibuilder/utilities/get-root-type');
const stripTypeNamespace = require('../../../utilities/apibuilder/utilities/strip-type-namespace');

function toDefaultExport(type) {
  return `${camelCase(getRootType(stripTypeNamespace(type)))}PropTypes`;
}

module.exports = toDefaultExport;
