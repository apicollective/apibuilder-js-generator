/**
 * Convert an apibuilder type into the appropriate react PropType.
 *
 * @param {String} apibuilderType - An apibuilder type, aka string, long, date-time-iso8601
 *
 * @returns The correct PropType string for the provided apibuilder type
 */
const apibuilderType2PropType = (apibuilderType) => {
  switch (apibuilderType) {
    case 'string':
    case 'date-iso8601':
    case 'date-time-iso8601':
    case 'uuid':
      return 'PropTypes.string';
    case 'boolean':
      return 'PropTypes.bool';
    case 'decimal':
    case 'double':
    case 'integer':
    case 'long':
      return 'PropTypes.number';
    case 'object':
      return 'PropTypes.object';
    default:
      return 'PropTypes.any';
  }
};

module.exports = apibuilderType2PropType;
