/**
 * Determines if an apibuilder type is an array, aka '[string]'
 *
 * @param {String} apibuilderType - An apibuilder type
 *
 * @returns Boolean - whether or not the apibuilder type is an array
 */
const isArray = apibuilderType => apibuilderType.startsWith('[');

module.exports = isArray;
