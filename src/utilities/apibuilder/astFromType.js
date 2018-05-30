const FullyQualifiedType = require('./FullyQualifiedType');

/**
 * Produces an AST given the name of a type as it appears in an API builder schema.
 * Useful to construct concrete types from strings.
 * @example
 * astFromType("string")
 * // => { name: "string" }
 * @example
 * astFromType("map[[string]]");
 * //=> { name: "map", type: { name: "array", type: { name: "string" } } }
 * @param {String} type
 * @return {Object}
 */
function astFromType(type) {
  return FullyQualifiedType.astFromType(type);
}

module.exports = astFromType;
