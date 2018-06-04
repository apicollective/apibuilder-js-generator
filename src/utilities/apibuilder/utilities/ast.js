const invariant = require('invariant');
const type = require('../type');
const schema = require('./schema');

/**
 * Produces an AST given the name of a type as it appears in an API builder schema.
 * Useful to construct concrete types from strings.
 * @example
 * astFromTypeName("string")
 * // => { name: "string" }
 * astFromTypeName("map[[string]]");
 * //=> { name: "map", type: { name: "array", type: { name: "string" } } }
 * @param {String} typeName
 * @return {Object}
 */
function astFromTypeName(typeName) {
  const {
    Kind,
    isMapTypeName,
    getNestedTypeName,
    isArrayTypeName,
  } = schema;

  switch (true) {
    case isMapTypeName(typeName):
      return {
        name: Kind.MAP,
        type: astFromTypeName(getNestedTypeName(typeName)),
      };
    case isArrayTypeName(typeName):
      return {
        name: Kind.ARRAY,
        type: astFromTypeName(getNestedTypeName(typeName)),
      };
    default:
      return { name: typeName };
  }
}

exports.astFromTypeName = astFromTypeName;


/**
 * Returns the type name for the specified API builder AST.
 * @example
 * typeNameFromAst({ name: "map", type: { name: "string" } });
 * //=> "map[string]"
 * @param {Object} ast
 * @returns {String}
 */
function typeNameFromAst(ast) {
  const { Kind } = schema;

  switch (ast.name) {
    case Kind.MAP:
      return `map[${typeNameFromAst(ast.type)}]`;
    case Kind.ARRAY:
      return `[${typeNameFromAst(ast.type)}]`;
    default:
      return ast.name;
  }
}

exports.typeNameFromAst = typeNameFromAst;

/**
 * Returns the API builder type from the specified API Builder AST.
 * Types are resolved from the provided service unless it is primitive type.
 * When resolving types, internal types will take precedence over external types.
 * That being said, using a short name to resolve a type is unreliable. For
 * best results, use a fully qualified type.
 * @param {String} ast
 * @param {ApiBuilderService} service
 * @returns {ApiBuilderType}
 */
function typeFromAst(ast, service) {
  const { FullyQualifiedType, Kind, isPrimitiveTypeName } = schema;
  const { ApiBuilderArray, ApiBuilderMap, ApiBuilderPrimitiveType } = type;

  if (ast.name === Kind.MAP) {
    return new ApiBuilderMap(typeFromAst(ast.type, service));
  } else if (ast.name === Kind.ARRAY) {
    return new ApiBuilderArray(typeFromAst(ast.type, service));
  } else if (isPrimitiveTypeName(ast.name)) {
    return new ApiBuilderPrimitiveType(new FullyQualifiedType(ast.name));
  }

  return (
    service.findModelByName(ast.name) ||
    service.findUnionByName(ast.name) ||
    service.findEnumByName(ast.name) ||
    invariant(false, `${ast.name} is not a type defined in ${String(service)} service.`)
  );
}

exports.typeFromAst = typeFromAst;

function mapType(type, fun) {
  const t = astFromTypeName(type);
  let inner = t;
  while (typeof inner.type !== 'undefined') {
    inner = inner.type;
  }
  inner.name = fun(inner.name);
  return typeNameFromAst(t);
}

exports.mapType = mapType;
