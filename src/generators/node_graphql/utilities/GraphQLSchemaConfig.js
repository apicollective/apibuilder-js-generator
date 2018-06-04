const toGraphQLOutputType = require('../utilities/toGraphQLOutputType');
const { get, flatMap, camelCase } = require('lodash');
const pluralize = require('pluralize');

const createLogger = require('debug');

const log = createLogger('apibuilder:graphql-schema');

class GraphQLSchemaConfig {
  constructor(config) {
    this.queries = config.queries;
  }

  /**
   * Creates a GraphQLSchemaConfig from an ApiBuilderService instance
   * @param {ApiBuilderService} service
   */
  static fromService(service) {
    const strOrVersion = (str) => new RegExp(`^${str}(?:_v\\d+)?$`)

    const queries = flatMap(service.resources, (resource) => {
      return resource.operations.filter(o => o.method === 'GET').map((operation) => {
        let name = 'TODO';
        if (operation.resultType.fullyQualifiedType.match(strOrVersion(resource.type.fullyQualifiedType)))
          name = camelCase(resource.type.shortName);
        else if (operation.resultType.baseType.match(strOrVersion(resource.type.fullyQualifiedType)))
          name = camelCase(resource.plural);
        else {
          const parts = operation.path.split('/').filter(x => x.length > 0 && x[0] != ':');
          if (parts.length > 0) {
            name = camelCase(`for_${resource.type.shortName}_get_${parts.join('_')}`);
          } else {
            log(`❌   unknown ${this.path}${op.path} => ${res.fullyQualifiedType}`);
          }
        }
        return {
          name,
          args: 'TODO',
          type: toGraphQLOutputType(operation.resultType, true),
          deprecationReason: get(operation, 'deprecation.description'),
          description: operation.description,
        };
      });
    });
    return new GraphQLSchemaConfig({ queries });
  }
}

module.exports = GraphQLSchemaConfig;