const camelCase = require('lodash/fp/camelCase');
const find = require('lodash/fp/find');
const getRootType = require('../../../utilities/apibuilder/utilities/get-root-type');
const isArray = require('../../../utilities/apibuilder/utilities/is-array');
const isMap = require('../../../utilities/apibuilder/utilities/is-map');
const stripTypeNamespace = require('../../../utilities/apibuilder/utilities/strip-type-namespace');

const apibuilderType2PropType = require('../utilities/apibuilder-type-2-prop-type');

/**
 * Generate code for the PropType definition of an apibuilder model entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum, model or union
 * @param {Service} service - A Service representing an apibuilder service definition
 *
 * @returns {String} - A code snippet for the PropType definition
 */
function generateModelPropType(entity, service) {
  const { entity: { fields } } = entity;
  const indexedEntity = service.getIndexedEntity(entity.name, service.getIndexed());
  const isIndexed = field =>
    find(childEntity => childEntity.name === getRootType(field.type), indexedEntity) ||
    find(childEntity => childEntity.id === getRootType(field.type), indexedEntity);

  let contents = '';
  contents += 'PropTypes.shape({\n';
  contents += fields.map((field) => {
    let propTypeChunk = '';
    if (isIndexed(field)) {
      propTypeChunk = `${camelCase(`${stripTypeNamespace(field.type)}_prop_type`)}()`;
    } else {
      propTypeChunk = apibuilderType2PropType(getRootType(field.type));
    }

    if (isArray(field.type)) {
      return `  ${field.name}: PropTypes.arrayOf(${propTypeChunk}),`;
    }

    if (isMap(field.type)) {
      return `  ${field.name}: PropTypes.objectOf(${propTypeChunk}),`;
    }

    return `  ${field.name}: ${propTypeChunk},`;
  }).join('\n');
  contents += '\n});';

  return contents;
}

module.exports = generateModelPropType;
