import debug from 'debug';
import { flatMap } from 'lodash';
import { matches } from 'lodash/fp';
import { ApiBuilderService, isEnclosingType } from '../../../utilities/apibuilder';
import GraphQLQuery from './GraphQLQuery';
import typeMatches from './typeMatches';

const log = debug('apibuilder:graphql-schema');

class GraphQLSchemaConfig {
  /**
   * Creates a GraphQLSchemaConfig from an ApiBuilderService instance
   */
  public static fromService(service: ApiBuilderService) {
    const queries = flatMap(service.resources, (resource) => {
      /*
      need to pick 1 operation for this resource to be the getter (e.g. getById)
      we pick the one that returns the type of the resource and that has the shortest URL

      the problem this fixes:
      GET  /:organization/orders/identifier/:identifier
        Returns information about a specific order using an identifier number
        => query named 'orderByIdentifier'
      GET  /:organization/orders/:number
        Returns information about a specific order.
        => query named 'order'
      */
      const getter = resource.operations
        .filter(matches({ method: 'GET' }))
        .filter(op => !isEnclosingType(op.resultType) && typeMatches(op.resultType, resource.type))
        .sort((a, b) => a.path.length - b.path.length)[0];

      if (getter) {
        log(
          resource.type.fullyQualifiedType.fullyQualifiedType,
          'getter',
          `${getter.resourcePath} + ${getter.path}`,
        );
      } else {
        log(resource.type.fullyQualifiedType.fullyQualifiedType, 'has no getter');
      }

      return resource.operations
        .filter(matches({ method: 'GET' }))
        .map(op => new GraphQLQuery(op, resource, service, op === getter));
    });
    return new GraphQLSchemaConfig({ queries });
  }

  public queries: GraphQLQuery[];

  constructor(config) {
    this.queries = config.queries;
  }
}

module.exports = GraphQLSchemaConfig;
