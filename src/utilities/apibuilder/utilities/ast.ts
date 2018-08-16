import invariant = require('invariant');
import {
  ApiBuilderArray,
  ApiBuilderMap,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  isArrayType,
  isMapType,
} from '../type';
import {
  FullyQualifiedType,
  getNestedTypeName,
  isArrayTypeName,
  isMapTypeName,
  isPrimitiveTypeName,
  Kind,
} from './schema';

export interface IAst {
  name: string;
  type?: IAst;
}

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
export function astFromTypeName(typeName): IAst {
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

/**
 * Returns the type name for the specified API builder AST.
 * @example
 * typeNameFromAst({ name: "map", type: { name: "string" } });
 * //=> "map[string]"
 * @param {Object} ast
 * @returns {String}
 */
export function typeNameFromAst(ast: IAst): string {
  switch (ast.name) {
    case Kind.MAP:
      return `map[${typeNameFromAst(ast.type)}]`;
    case Kind.ARRAY:
      return `[${typeNameFromAst(ast.type)}]`;
    default:
      return ast.name;
  }
}

/**
 * Returns the API builder type from the specified API Builder AST.
 * Types are resolved from the provided service unless it is primitive type.
 * When resolving types, internal types will take precedence over external types.
 * That being said, using a short name to resolve a type is unreliable. For
 * best results, use a fully qualified type.
 * @param {{name: String, type: Object}} ast
 * @param {ApiBuilderService} service
 * @returns {ApiBuilderType}
 */
export function typeFromAst(ast: IAst, service: any): ApiBuilderType {
  if (ast.name === Kind.MAP) {
    return new ApiBuilderMap(typeFromAst(ast.type, service));
  }

  if (ast.name === Kind.ARRAY) {
    return new ApiBuilderArray(typeFromAst(ast.type, service));
  }

  if (isPrimitiveTypeName(ast.name)) {
    return new ApiBuilderPrimitiveType(new FullyQualifiedType(ast.name));
  }

  return (
    service.findModelByName(ast.name) ||
    service.findUnionByName(ast.name) ||
    service.findEnumByName(ast.name) ||
    invariant(false, `${ast.name} is not a type defined in ${String(service)} service.`)
  );
}

export function astFromType(type: ApiBuilderType): IAst {
  if (isMapType(type)) {
    return {
      name: Kind.MAP,
      type: astFromType(type.ofType),
    };
  }

  if (isArrayType(type)) {
    return {
      name: Kind.ARRAY,
      type: astFromType(type.ofType),
    };
  }

  return {
    name: type.shortName,
  };
}
