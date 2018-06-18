const toGraphQLOutputType = require('../utilities/toGraphQLOutputType');
const { isEnclosingType, getBaseType, isPrimitiveType, isEnumType } = require('../../../utilities/apibuilder')
const { flatMap, camelCase, concat } = require('lodash');
const { get, matches } = require('lodash/fp');

const createLogger = require('debug');

const log = createLogger('apibuilder:graphql-schema');

class GraphQLQueryArgConfig {
  constructor(arg) {
    this.name = arg.name;
    this.fullyQualifiedType = arg.type;
    this.required = arg.required;
    this.default = arg.defaultValue;
    this.description = arg.description;
  }

  get type() {
    return toGraphQLOutputType(this.fullyQualifiedType, this.required);
  }

  get defaultValue() {
    if (this.default) {
      if ((isPrimitiveType(this.fullyQualifiedType) && this.fullyQualifiedType.typeName === 'string')
        || isEnumType(this.fullyQualifiedType))
        return `'${this.default}'`;
      else
        return this.default;
    }
  }
}

class GraphQLQuery {
  constructor(operation, resource, service) {
    this.config = {
      operation,
      resource,
      service
    };
  }

  get name() {
    const strOrVersion = (str) => new RegExp(`^${str}(?:_v\\d+)?$`);

    if (isEnclosingType(this.config.operation.resultType)
     && getBaseType(this.config.operation.resultType).fullyQualifiedType.fullyQualifiedType.match(strOrVersion(this.config.resource.type))) {
      return camelCase(this.config.resource.plural);
    } else if (!isEnclosingType(this.config.operation.resultType)
            && this.config.operation.resultType.fullyQualifiedType.fullyQualifiedType.match(strOrVersion(this.config.resource.type))) {
      return camelCase(this.config.resource.type.shortName);
    } else {
      const parts = this.config.operation.path.split('/').filter(x => x.length > 0 && x[0] != ':');
      if (parts.length > 0) {
        return camelCase(`for_${this.config.resource.type.shortName}_get_${parts.join('_')}`);
      } else {
        log(`❌   unknown ${this.config.resource.path}${this.config.operation.path} => ${this.config.operation.resultType.fullyQualifiedType}`);
        return 'TODO';
      }
    }
  }

  get args() {
    return this.config.operation.arguments
      .map(arg => new GraphQLQueryArgConfig(arg));
  }

  get type() {
    return toGraphQLOutputType(this.config.operation.resultType, true);
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
        .filter(x => x.length > 0)
    );
  }

  get queryParts() {
    return this.config.operation.arguments
      .filter(matches({ location: 'Query' }))
      .map(get('name'));
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
    const queries = flatMap(service.resources, resource =>
      resource.operations
        .filter(matches({ method: 'GET' }))
        .map(op => new GraphQLQuery(op, resource, service))
    );
    return new GraphQLSchemaConfig({ queries });
  }
}

module.exports = GraphQLSchemaConfig;