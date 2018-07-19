import { ApiBuilderBaseType, ApiBuilderOperation, astFromTypeName, typeFromAst } from '..';

/**
 * An APIBuilder resource
 */
export class ApiBuilderResource {
  public operations: ApiBuilderOperation[];
  private config: any;
  private service: any;

  constructor(config, service) {
    this.config = config;
    this.service = service;

    // moved out of getter so that we can use === to check for equality
    this.operations = this.config.operations.map(op =>
      ApiBuilderOperation.fromSchema(op, this, this.service));
  }

  get type(): ApiBuilderBaseType {
    // TODO: is this type assertion correct?
    return typeFromAst(astFromTypeName(this.config.type), this.service) as ApiBuilderBaseType;
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
