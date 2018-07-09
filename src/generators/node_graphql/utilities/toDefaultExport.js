const { getBaseType, isType } = require('../../../utilities/apibuilder');
const pascalCase = require('./pascalCase');
const invariant = require('invariant');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  invariant(isType(type), 'toDefaultExport() takes an ApiBuilderType');
  const baseType = getBaseType(type);
  return pascalCase(baseType.shortName);
}

module.exports = toDefaultExport;
