/**
 * Removes the namespace from an apibuilder type. Aka:
 *
 * io.flow.common.v0.models.address -> address
 *
 * @param {String} apibuilderType - An apibuilder type that may or may not include a namespace,
 *                                  aka io.flow.common.v0.models.address
 *
 * @returns String - the apibuilder type with any namespace removed.
 */
const stripTypeNamespace = apibuilderType => apibuilderType.substring(apibuilderType.lastIndexOf('.') + 1);

module.exports = stripTypeNamespace;
