const toDefaultExport = require('./toDefaultExport');
const { ApiBuilderService } = require('../../../utilities/apibuilder');

/**
 * Returns the destination path for the GraphQL schema generated from the
 * specified API Builder type.
 * @param {ApiBuilderType|ApiBuilderService} type
 */
function destinationPathFromType(type) {
  if (type instanceof ApiBuilderService) {
    const $1 = type.namespace.split('.').join('/');
    const $2 = 'schema';
    return `${$1}/${$2}.js`;
  } else {
    const $1 = type.packageName.split('.').join('/');
    const $2 = toDefaultExport(type);
    return `${$1}/${$2}.js`;
  }
}

module.exports = destinationPathFromType;
