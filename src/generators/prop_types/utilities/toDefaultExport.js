const camelCase = require('lodash/camelCase');

/**
 * Calculates default export name for writing into generated code.
 * @param {Entity} entity - the entity in question
 */
function toDefaultExport(entity) {
  return `${camelCase(entity.shortName)}PropTypes`;
}

module.exports = toDefaultExport;
