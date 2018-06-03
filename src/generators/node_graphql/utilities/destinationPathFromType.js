const toDefaultExport = require('./toDefaultExport');

/**
 * Returns the destination path for the GraphQL schema generated from the
 * specified API Builder type.
 * @param {ApiBuilderType} type
 */
function destinationPathFromType(type) {
  const $1 = type.packageName.split('.').join('/');
  const $2 = toDefaultExport(type);
  return `lib/schema/types/${$1}/${$2}.js`;
}

module.exports = destinationPathFromType;
