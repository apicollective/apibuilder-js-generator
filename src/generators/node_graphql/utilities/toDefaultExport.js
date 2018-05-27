const pascalCase = require('./pascalCase');

/**
 * Calculates default export name for writing into generated code.
 * @param {ApiBuilderType} type - the type in question
 */
function toDefaultExport(type) {
  return pascalCase(type.shortName);
}

module.exports = toDefaultExport;
