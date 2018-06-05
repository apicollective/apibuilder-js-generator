const invariant = require('invariant');
const path = require('path');

const ImportDeclaration = require('../../../utilities/language/ImportDeclaration');
const toModuleName = require('./toModuleName');
const toDefaultExport = require('./toDefaultExport');

// TODO: Unless this evolves into something else we should be able to share this
// utility between generators or at least extract the common parts.

/**
 * Calculates import statement for writing into generated code.
 * @param {?ApiBuilderType} source - The type where other type will be imported from.
 * @param {ApiBuilderType} target - The type to be imported.
 */
function toImportStatement(source, target) {
  invariant(target != null, 'A target type must be provided');

  const sourcePath = toModuleName(source);
  const targetPath = toModuleName(target);

  let moduleName;

  if (path.dirname(sourcePath) === path.dirname(targetPath)) {
    moduleName = `./${path.basename(targetPath)}`;
  } else {
    moduleName = `./${path.relative(path.dirname(sourcePath), targetPath)}`;
  }

  return new ImportDeclaration({
    defaultExport: toDefaultExport(target),
    moduleName,
  });
}

module.exports = toImportStatement;
