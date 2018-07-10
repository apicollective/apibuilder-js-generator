const camelCase = require('lodash/camelCase');
const invariant = require('invariant');
const upperFirst = require('lodash/upperFirst');

const { getBaseType, isType } = require('../../../utilities/apibuilder');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  invariant(isType(type), `${String(type)} is not an API Builder type.`);
  const baseType = getBaseType(type);
  const defaultExport = upperFirst(camelCase(baseType.shortName));
  return defaultExport;
}

module.exports = toDefaultExport;
