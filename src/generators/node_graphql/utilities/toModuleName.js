const { getBaseType } = require('../../../utilities/apibuilder');
const toDefaultExport = require('./toDefaultExport');
const { ApiBuilderService } = require('../../../utilities/apibuilder');

/**
 * Calculates the module name for writing into generated code.
 * @param {ApiBuilderType|ApiBuilderService} type - The type in question
 */
function toModuleName(type) {
  if (type instanceof ApiBuilderService) {
    return type.namespace.split('.').concat(['schema']).join('/');
  }

  // type is an ApiBuilderType
  const baseType = getBaseType(type);
  return baseType.packageName
    .split('.')
    .concat(toDefaultExport(baseType))
    .join('/');
}

module.exports = toModuleName;
