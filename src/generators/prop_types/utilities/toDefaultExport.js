const camelCase = require('lodash/camelCase');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  return `${camelCase(type.shortName)}PropTypes`;
}

module.exports = toDefaultExport;
