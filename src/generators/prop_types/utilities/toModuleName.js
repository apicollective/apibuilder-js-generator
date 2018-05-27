const toDefaultExport = require('./toDefaultExport');


/**
 * Calculates the module name for writing into generated code.
 * @param {ApiBuilderType} type - The type in question
 */
function toModuleName(type) {
  return type.packageName.split('.').concat(toDefaultExport(type)).join('/');
}

module.exports = toModuleName;
