const camelCase = require('lodash/camelCase');
const { getBaseType } = require('../../../utilities/apibuilder');

/**
 * Calculates the module name for writing into generated code.
 * @param {ApiBuilderType} type - The type in question
 */
function toModuleName(type) {
  const baseType = getBaseType(type);
  return baseType.packageName
    .split('.')
    .concat(camelCase(baseType.shortName))
    .join('/');
}

module.exports = toModuleName;
