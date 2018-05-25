const pascalCase = require('./pascalCase');

/**
 * Calculates default export name for writing into generated code.
 * @param {Entity} entity - the entity in question
 */
function toDefaultExport(entity) {
  return pascalCase(entity.shortName);
}

module.exports = toDefaultExport;
