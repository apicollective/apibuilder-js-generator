const toDefaultExport = require('./toDefaultExport');

/**
 * Calculates the module name for writing into generated code.
 * @param {Entity} entity - The entity in question
 */
function toModuleName(entity) {
  return ['types']
    .concat(entity.packageName.split('.'))
    .concat(toDefaultExport(entity))
    .join('/');
}

module.exports = toModuleName;
