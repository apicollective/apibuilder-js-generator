const camelCase = require('lodash/camelCase');
const { getBaseType } = require('../../../utilities/apibuilder');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  // TODO: Use invariant to check type is valid type.
  const baseType = getBaseType(type);
  return `${camelCase(baseType.shortName)}PropTypes`;
}

module.exports = toDefaultExport;
