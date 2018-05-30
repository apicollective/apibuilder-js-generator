const getBaseType = require('../../../utilities/apibuilder/getBaseType');
const pascalCase = require('./pascalCase');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  const baseType = getBaseType(type);
  return pascalCase(baseType.shortName);
}

module.exports = toDefaultExport;
