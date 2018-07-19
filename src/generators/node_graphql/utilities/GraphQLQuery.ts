import debug = require('debug');
import invariant = require('invariant');
import { camelCase, concat, matches, partition } from 'lodash';
import { get } from 'lodash/fp';
import {
  ApiBuilderOperation,
  ApiBuilderResource,
  ApiBuilderService,
  getBaseType,
  isEnclosingType,
  isPrimitiveType,
} from '../../../utilities/apibuilder';
import GraphQLQueryArgConfig from './GraphQLQueryArgConfig';
import toGraphQLOutputType = require('./toGraphQLOutputType');

const log = debug('apibuilder:graphql-query');

interface IGraphQLQueryConfig {
  operation: ApiBuilderOperation;
  resource: ApiBuilderResource;
  service: ApiBuilderService;
  isPrimaryGetter: boolean;
}

export default class GraphQLQuery {
  private config: IGraphQLQueryConfig;

  constructor(
    operation: ApiBuilderOperation,
    resource: ApiBuilderResource,
    service: ApiBuilderService,
    isPrimaryGetter: boolean,
  ) {
    this.config = {
      isPrimaryGetter,
      operation,
      resource,
      service,
    };
  }

  get name() {
    const { resource, operation } = this.config;
    const { path, resultType } = this.config.operation;

    const [staticParts, queryParts] = partition(
      path.split('/').filter(x => x.length > 0),
      x => x[0] !== ':',
    );

    if (isEnclosingType(resultType) && typeMatches(getBaseType(resultType), resource.type)) {
      // Gets multiple instances of this resource
      return camelCase(this.config.resource.plural);
    }

    if (!isEnclosingType(resultType) && typeMatches(resultType, resource.type)) {
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
    }

    if (staticParts.length > 0) {
      // Get sub-resource
      let res = `for_${resource.type.shortName}_get_${staticParts.join('_')}`;
      if (queryParts.length > 0) {
        res += `_by_${queryParts.join('_and_')}`;
      }
      // tslint:disable-next-line:max-line-length
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
}
