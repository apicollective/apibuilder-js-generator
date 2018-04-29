const camelCase = require('lodash/fp/camelCase');

/**
 * Generate code for the PropType definition of a union entity.
 *
 * @param {Object} entity - An object representing a union apibuilder entity
 *
 * @returns {String} - A code snippet for the PropType definition
 */
function generateUnionPropType(entity) {
  const { entity: { types } } = entity;

  let contents = '';
  contents += 'PropTypes.oneOfType([\n';
  contents += types.map(t => `  ${camelCase(`${t.type}_prop_type`)}(),`).join('\n');
  contents += '\n]);';

  return contents;
}

module.exports = generateUnionPropType;
