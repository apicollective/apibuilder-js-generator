const invariant = require('invariant');

const ApiBuilderArray = require('./ApiBuilderArray');
const ApiBuilderMap = require('./ApiBuilderMap');
const ApiBuilderPrimitiveType = require('./ApiBuilderPrimitiveType');
const FullyQualifiedType = require('./FullyQualifiedType');
const TypeKind = require('./TypeKind');

/**
 * Returns the API builder type from its API Builder AST representation.
 * Types are resolved from the provided service unless it is primitive type.
 * When resolving types, internal types will take precedence over external types.
 * That being said, using a short name to resolve a type is unreliable. For
 * best results, use a fully qualified type.
 * @param {String} string
 * @param {ApiBuilderService} service
 */
function typeFromAst(ast, service) {
  if (ast.name === TypeKind.MAP) {
    return new ApiBuilderMap(typeFromAst(ast.type, service));
  } else if (ast.name === TypeKind.ARRAY) {
    return new ApiBuilderArray(typeFromAst(ast.type, service));
  } else if (FullyQualifiedType.isPrimitiveType(ast.name)) {
    return new ApiBuilderPrimitiveType(new FullyQualifiedType(ast.name), service);
  }

  return (
    service.findModelByName(ast.name) ||
    service.findUnionByName(ast.name) ||
    service.findEnumByName(ast.name) ||
    invariant(false, `${ast.name} is not a type defined in ${String(service)} service.`)
  );
}


module.exports = typeFromAst;
