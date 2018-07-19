const invariant = require('invariant');
const path = require('path');

const { isType } = require('../../../utilities/apibuilder');
const toModuleName = require('./toModuleName');
const toDefaultExport = require('./toDefaultExport');

/**
 * Calculates export statement for writing into generated code.
 */
function toExportStatement(type, rootPath) {
  invariant(isType(type), `${String(type)} is not an API builder type.`);

  const defaultExport = toDefaultExport(type);

  let moduleName = toModuleName(type);

  if (path.dirname(rootPath) === path.dirname(moduleName)) {
    moduleName = `./${path.basename(moduleName)}`;
  } else {
    moduleName = path.relative(path.dirname(rootPath), moduleName);
    moduleName = moduleName.startsWith('.') ? moduleName : `./${moduleName}`;
  }

  return { defaultExport, moduleName };
}

module.exports = toExportStatement;
