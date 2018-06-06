const {
  FullyQualifiedType,
  mapType,
  typeFromAst,
  astFromTypeName
} = require('../utilities');

const {
  camelCase,
  get,
  map
} = require('lodash');

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

    if (this.config.path.startsWith(resourcePath))
      this.trimmedPath = this.config.path.substring(resourcePath.length);
    else
      this.trimmedPath = this.config.path;
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
    return this.trimmedPath;
  }

  get resultType() {
    const type = get(
      this.config.responses.filter(r => r.code.integer.value >= 200 && r.code.integer.value < 300), // find 2xx code
      '[0].type',
      'unit'
    );
    return typeFromAst(astFromTypeName(type), this.service);
  }

  get arguments() {
    return map(this.config.parameters, arg =>
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
    return map(this.config.operations, op =>
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