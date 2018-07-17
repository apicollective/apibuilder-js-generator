import toGraphQLOutputType = require('./toGraphQLOutputType');
import {
  isEnclosingType,
  getBaseType,
  isPrimitiveType,
  isEnumType,
  ApiBuilderType,
  ApiBuilderBaseType,
  ApiBuilderOperation,
  ApiBuilderResource,
  ApiBuilderService,
  ApiBuilderOperationArgument,
  ApiBuilderModel,
  isModelType,
} from '../../../utilities/apibuilder';
import { flatMap, camelCase, concat, partition } from 'lodash';
import { get, matches } from 'lodash/fp';
import { isReference, getFullType } from './reference';
import invariant = require('invariant');

import createLogger from 'debug';

const log = createLogger('apibuilder:graphql-schema');

/**
 * Returns whether the type matches str, str_v2, str_v*...
 */
function typeMatches(type: ApiBuilderBaseType, str: string) {
  return type.fullyQualifiedType.fullyQualifiedType.match(new RegExp(`^${str}(?:_v\\d+)?$`));
}

class GraphQLQueryArgConfig {
  name: string;
  fullyQualifiedType: ApiBuilderType;
  required: boolean;
  default: string;
  description: string;
  service: ApiBuilderService;

  constructor(arg: ApiBuilderOperationArgument, service: ApiBuilderService) {
    this.name = arg.name;
    this.fullyQualifiedType = arg.type;
    this.required = arg.required;
    this.default = arg.defaultValue;
    this.description = arg.description;
    this.service = service;
  }

  get type() {
    return toGraphQLOutputType(this.fullyQualifiedType, this.required, this.service);
  }

  get defaultValue() {
    if (this.default) {
      if (isPrimitiveType(this.fullyQualifiedType) && this.fullyQualifiedType.typeName === 'string') {
        return `'${this.default}'`; // strings
      }

      if (isEnumType(this.fullyQualifiedType)) {
        return `'${this.default}'`; // enums
      }

      return this.default;
    }
    return undefined;
  }
}

interface GraphQLQueryConfig {
  operation: ApiBuilderOperation;
  resource: ApiBuilderResource;
  service: ApiBuilderService;
  isPrimaryGetter: boolean;
}

class GraphQLQuery {
  config: GraphQLQueryConfig;

  constructor(operation: ApiBuilderOperation, resource: ApiBuilderResource, service: ApiBuilderService, isPrimaryGetter: boolean) {
    this.config = {
      operation,
      resource,
      service,
      isPrimaryGetter,
    };
  }

  get name() {
    const { resource, operation } = this.config;
    const { path, resultType } = this.config.operation;

    const [staticParts, queryParts] = partition(
      path.split('/').filter(x => x.length > 0),
      x => x[0] !== ':',
    );

    if (isEnclosingType(resultType) && typeMatches(getBaseType(resultType), resource.type.toString())) {
      // Gets multiple instances of this resource
      return camelCase(this.config.resource.plural);
    } else if (!isEnclosingType(resultType) && typeMatches(resultType, resource.type.toString())) {
      // Gets a single instance of this resource
      if (this.config.isPrimaryGetter) {
        return camelCase(resource.type.shortName); // primary getter is just resource name
      }

      invariant(
        queryParts.length > 0,
        `Non-primary getter needs to have a different URL from the primary getter.
        Resource = ${resource.type.fullyQualifiedType.fullyQualifiedType}
        Operation = ${resource.path}${path}`,
      );
      return camelCase(`${resource.type.shortName}_by_${queryParts.join('_')}`); // get by {args}
    } else if (staticParts.length > 0) {
      // Get sub-resource
      let res = `for_${resource.type.shortName}_get_${staticParts.join('_')}`;
      if (queryParts.length > 0) {
        res += `_by_${queryParts.join('_and_')}`;
      }
      log(`${resource.type.fullyQualifiedType.fullyQualifiedType}:\t${resource.path}${operation.path} => ${camelCase(res)}`);
      return camelCase(res);
    }

    log(`❌   unknown ${resource.path}${operation.path} => ${resultType}`);
    return 'TODO';
  }

  get args() {
    return this.config.operation.arguments.map(arg =>
      new GraphQLQueryArgConfig(arg, this.config.service));
  }

  get type() {
    return toGraphQLOutputType(this.config.operation.resultType, true, this.config.service);
  }

  get isListType() {
    return isEnclosingType(this.config.operation.resultType);
  }

  get isPrimitiveType() {
    return isPrimitiveType(getBaseType(this.config.operation.resultType));
  }

  get deprecationReason() {
    return get('deprecation.description', this.config.operation);
  }

  get description() {
    return this.config.operation.description;
  }

  get pathParts() {
    return concat(
      this.config.service.baseUrl,
      (this.config.resource.path + this.config.operation.path)
        .split('/')
        .filter(x => x.length > 0),
    );
  }

  get queryParts() {
    return this.config.operation.arguments
      .filter(matches({ location: 'Query' }))
      .map(get('name'));
  }

  get references() {
    return [
      ['targeting', 'catalog', 'organization'],
    ];
    function findReferences(type: ApiBuilderModel) {
      type.fields.forEach((field) => {
        if (isReference(field.type)) {

        }
      });
    }
    const { resultType } = this.config.operation;
    if (isModelType(resultType)) {
      resultType.fields
    }
  }
}

class GraphQLSchemaConfig {
  queries: GraphQLQuery[];

  constructor(config) {
    this.queries = config.queries;
  }

  /**
   * Creates a GraphQLSchemaConfig from an ApiBuilderService instance
   */
  static fromService(service: ApiBuilderService) {
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
        .filter(op => !isEnclosingType(op.resultType) && typeMatches(op.resultType, resource.type.toString()))
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
}

module.exports = GraphQLSchemaConfig;