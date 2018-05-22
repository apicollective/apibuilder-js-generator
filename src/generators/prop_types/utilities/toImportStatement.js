const path = require('path');
const toModuleName = require('./toModuleName');
const toDefaultExport = require('./toDefaultExport');

/**
 * Calculates import statement for writing into generated code.
 * @param {Entity} source - The entity where other entity will be imported from.
 * @param {Entity} target - The entity to be imported.
 */
function toImportStatement(source, target) {
  const sourcePath = toModuleName(source);
  const targetPath = toModuleName(target);
  return {
    defaultExport: toDefaultExport(target),
    moduleName: path.relative(sourcePath, targetPath),
  };
}

module.exports = toImportStatement;
