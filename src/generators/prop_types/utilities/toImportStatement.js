const invariant = require('invariant');
const path = require('path');
const toModuleName = require('./toModuleName');
const toDefaultExport = require('./toDefaultExport');

/**
 * Calculates import statement for writing into generated code.
 * @param {ApiBuilderType} source - The type where other type will be imported from.
 * @param {ApiBuilderType} target - The type to be imported.
 */
function toImportStatement(source, target) {
  invariant(source != null, 'A source type must be provided');
  invariant(target != null, 'A target type must be provided');
  const sourcePath = toModuleName(source);
  const targetPath = toModuleName(target);
  // console.log(path.resolve(sourcePath, targetPath));
  let moduleName;

  if (path.dirname(sourcePath) === path.dirname(targetPath)) {
    moduleName = `./${path.basename(targetPath)}`;
  } else {
    moduleName = path.relative(path.dirname(sourcePath), targetPath);
  }

  return {
    defaultExport: toDefaultExport(target),
    moduleName,
  };
}

module.exports = toImportStatement;
