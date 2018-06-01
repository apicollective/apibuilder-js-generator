const { getBaseType } = require('../../../utilities/apibuilder');
const toDefaultExport = require('./toDefaultExport');


/**
 * Calculates the module name for writing into generated code.
 * @param {ApiBuilderType} type - The type in question
 */
function toModuleName(type) {
  const baseType = getBaseType(type);
  return baseType.packageName
    .split('.')
    .concat(toDefaultExport(baseType))
    .join('/');
}

module.exports = toModuleName;
