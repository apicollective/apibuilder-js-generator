/**
 * Determines if an apibuilder type is a map, aka 'map[string]'
 *
 * @param {String} apibuilderType - An apibuilder type
 *
 * @returns Boolean - whether or not the apibuilder type is a map
 */
const isMap = apibuilderType => apibuilderType.startsWith('map[');

module.exports = isMap;
