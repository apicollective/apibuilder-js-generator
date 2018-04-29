/**
 * Gets the 'root' type of an apibuilder type. apibuilder types can be complex, like arrays
 * ([string]) or maps (map[string]). This function strips out the meta types like array and map and
 * returns the base type.
 *
 * @param {String} apibuilderType - The apibuilder type to normalize
 *
 * @returns the root type of the given apibuilder type
 */
const getRootType = apibuilderType => apibuilderType.replace(/map\[/g, '').replace(/\[/g, '').replace(/\]/g, '');

module.exports = getRootType;
