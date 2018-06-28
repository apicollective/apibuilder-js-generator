const { typeFromAst, astFromTypeName } = require('../utilities');
const {
  get,
  getOr,
  flow,
  inRange,
} = require('lodash/fp');

/**
 * The arguments of an APIBuilder operation
 */
class ApiBuilderOperationArgument {
  constructor(config, service) {
    this.config = config;
    this.service = service;
  }

  get name() {
    return this.config.name;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get defaultValue() {
    return this.config.default;
  }

  get description() {
    return this.config.description;
  }

  get location() {
    return this.config.location;
  }

  get required() {
    return this.config.required;
  }

  static fromSchema(config, service) {
    return new ApiBuilderOperationArgument(config, service);
  }
}

exports.ApiBuilderOperationArgument = ApiBuilderOperationArgument;


/**
 * An APIBuilder operation, inside of a resource
 */
class ApiBuilderOperation {
  constructor(config, resourcePath, service) {
    this.config = config;
    this.service = service;
    this.resourcePath = resourcePath;
  }

  get method() {
    return this.config.method;
  }

  get defaultValue() {
    return this.config.default;
  }

  get deprecationReason() {
    return this.config.deprecationReason;
  }

  get description() {
    return this.config.description;
  }

  get path() {
    if (this.config.path.startsWith(this.resourcePath)) {
      return this.config.path.substring(this.resourcePath.length);
    }

    return this.config.path;
  }

  get resultType() {
    const type = getOr(
      'unit',
      'type',
      this.config.responses.find(flow(
        get('code.integer.value'),
        inRange(200, 300),
      )),
    );

    return typeFromAst(astFromTypeName(type), this.service);
  }

  get arguments() {
    return this.config.parameters.map(arg =>
      ApiBuilderOperationArgument.fromSchema(arg, this.service));
  }

  static fromSchema(config, resource, service) {
    return new ApiBuilderOperation(config, resource.path, service);
  }
}

exports.ApiBuilderOperation = ApiBuilderOperation;


/**
 * An APIBuilder resource
 */
class ApiBuilderResource {
  constructor(config, service) {
    this.config = config;
    this.service = service;

    // moved out of getter so that we can use === to check for equality
    this.operations = this.config.operations.map(op =>
      ApiBuilderOperation.fromSchema(op, this, this.service));
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get plural() {
    return this.config.plural;
  }

  get namespace() {
    return this.service.namespace;
  }

  get path() {
    return this.config.path;
  }
}

exports.ApiBuilderResource = ApiBuilderResource;
