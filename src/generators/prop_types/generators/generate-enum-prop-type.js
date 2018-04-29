/**
 * Generate code for the PropType definition of an enum entity.
 *
 * @param {Object} entity - An object representing an apibuilder enum entity
 *
 * @returns {String} - A code snippet for the PropType definition
 */
function generateEnumPropType(entity) {
  const { entity: { values } } = entity;

  let contents = '';
  contents += 'PropTypes.oneOf([\n';
  contents += values.map(v => `  '${v.name}',`).join('\n');
  contents += '\n]);';

  return contents;
}

module.exports = generateEnumPropType;
