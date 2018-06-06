const toGraphQLOutputType = require('../utilities/toGraphQLOutputType');
const toGraphQLScalarType = require('../utilities/toGraphQLScalarType');
const { FullyQualifiedType, mapType, isEnclosingType, getBaseType, isArrayType } = require('../../../utilities/apibuilder')
const { get, map, flatMap, camelCase, some, reduce } = require('lodash');

const createLogger = require('debug');

const log = createLogger('apibuilder:graphql-schema');

class GraphQLQueryArgConfig {
  constructor(arg, namespace) {
    this.name = arg.name;
    this.fullyQualifiedType = arg.type;
    this.required = arg.required;
    this.defaultValue = arg.default;
    this.description = arg.description;
  }

  get type() {
    return toGraphQLOutputType(this.fullyQualifiedType, this.required);
  }
}

/**
 * @param {ApiBuilderOperation} operation
 * @param {ApiBuilderResource} resource
 */
function getQueryName(operation, resource) {
  const strOrVersion = (str) => new RegExp(`^${str}(?:_v\\d+)?$`);

  if (isEnclosingType(operation.resultType) && getBaseType(operation.resultType).fullyQualifiedType.fullyQualifiedType.match(strOrVersion(resource.type))) {
    return camelCase(resource.plural);
  } else if (!isEnclosingType(operation.resultType) && operation.resultType.fullyQualifiedType.fullyQualifiedType.match(strOrVersion(resource.type))) {
    return camelCase(resource.type.shortName);
  } else {
    const parts = operation.path.split('/').filter(x => x.length > 0 && x[0] != ':');
    if (parts.length > 0) {
      return camelCase(`for_${resource.type.shortName}_get_${parts.join('_')}`);
    } else {
      log(`❌   unknown ${this.path}${op.path} => ${operation.resultType.fullyQualifiedType}`);
      return 'TODO';
    }
  }
}

class GraphQLSchemaConfig {
  constructor(config) {
    this.queries = config.queries;
  }

  /**
   * Creates a GraphQLSchemaConfig from an ApiBuilderService instance
   * @param {ApiBuilderService} service
   */
  static fromService(service) {
    const queries = flatMap(service.resources, (resource) => {
      return map(resource.operations.filter(o => o.method === 'GET'), (operation) => {
        return {
          name: getQueryName(operation, resource),
          args: map(operation.arguments, (arg) => new GraphQLQueryArgConfig(arg, service.namespace)),
          type: toGraphQLOutputType(operation.resultType, true),
          deprecationReason: get(operation, 'deprecation.description'),
          description: operation.description,
          pathParts: [service.baseUrl].concat((resource.path + operation.path).split('/').filter(x => x.length > 0)),
          queryParts: operation.arguments.filter(a => a.location === 'Query').map(p => p.name)
        };
      });
    });
    return new GraphQLSchemaConfig({ queries });
  }
}

module.exports = GraphQLSchemaConfig;