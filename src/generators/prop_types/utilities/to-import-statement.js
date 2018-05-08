const isEntityOfType = require('./is-entity-of-type');
const toDefaultExport = require('./to-default-export');

function toModuleName(type, entities) {
  switch (true) {
    case isEntityOfType(type, 'model', entities):
      return `../model/${toDefaultExport(type)}`;
    case isEntityOfType(type, 'union', entities):
      return `../union/${toDefaultExport(type)}`;
    case isEntityOfType(type, 'enum', entities):
      return `../enum/${toDefaultExport(type)}`;
    default:
      throw new Error(`Could not determine module name of import statement for type [${type}]`);
  }
}

function toImportStatement(type, entities) {
  const defaultExport = toDefaultExport(type);
  const moduleName = toModuleName(type, entities);
  return { defaultExport, moduleName };
}

module.exports = toImportStatement;
