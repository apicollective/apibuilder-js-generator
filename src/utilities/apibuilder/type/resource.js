const { typeFromAst, astFromTypeName } = require('../utilities');
const { get, map } = require('lodash');
const { conforms, inRange } = require('lodash/fp');

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
};

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

  get name() {
    return this.config.name;
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
    if (this.config.path.startsWith(this.resourcePath))
      return this.config.path.substring(this.resourcePath.length);
    else
      return this.config.path;
  }

  get resultType() {
    const type = get(
      this.config.responses.find(conforms({
        code: conforms({
          integer: conforms({
            value: inRange(200, 300)
          })
        })
      })),
      'type',
      'unit'
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
};

exports.ApiBuilderOperation = ApiBuilderOperation;


/**
 * An APIBuilder resource
 */
class ApiBuilderResource {
  constructor(config, service) {
    this.config = config;
    this.service = service;
  }

  get type() {
    return typeFromAst(astFromTypeName(this.config.type), this.service);
  }

  get plural() {
    return this.config.plural;
  }

  get operations() {
    return this.config.operations.map(op =>
      ApiBuilderOperation.fromSchema(op, this, this.service));
  }

  get namespace() {
    return this.service.namespace;
  }

  get path() {
    return this.config.path;
  }
};

exports.ApiBuilderResource = ApiBuilderResource;