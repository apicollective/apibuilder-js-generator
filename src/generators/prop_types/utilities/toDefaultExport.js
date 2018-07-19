const camelCase = require('lodash/camelCase');
const invariant = require('invariant');

const { getBaseType, isType } = require('../../../utilities/apibuilder');
const isReservedWord = require('./isReservedWord');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  invariant(isType(type), `${String(type)} is not an API Builder type.`);
  const baseType = getBaseType(type);
  const defaultExport = camelCase(baseType.shortName);
  return isReservedWord(defaultExport) ? `$${defaultExport}` : defaultExport;
}

module.exports = toDefaultExport;
