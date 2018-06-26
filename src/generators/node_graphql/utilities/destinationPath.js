const toDefaultExport = require('./toDefaultExport');

/**
 * Returns the destination path for the GraphQL schema generated from the
 * specified API Builder type.
 * @param {ApiBuilderType} type
 */
function destinationPathFromType(type) {
  const $1 = type.packageName.split('.').join('/');
  const $2 = toDefaultExport(type);
  return `${$1}/${$2}.js`;
}

/**
 * Returns the destination path for the GraphQL schema
 * @param {ApiBuilderService} service
 */
function destinationPathFromService(service) {
  return `${service.namespace.split('.').join('/')}/schema.js`;
}

function destinationDirForScalars(service) {
  return service.namespace.split('.').join('/');
}

module.exports = {
  destinationPathFromType,
  destinationPathFromService,
  destinationDirForScalars
};