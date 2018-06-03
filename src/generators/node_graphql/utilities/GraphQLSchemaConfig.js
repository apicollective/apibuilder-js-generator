const toGraphQLOutputType = require('../utilities/toGraphQLOutputType');
const { get, flatMap, camelCase } = require('lodash');

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