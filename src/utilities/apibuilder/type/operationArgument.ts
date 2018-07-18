import { astFromTypeName, typeFromAst } from '../utilities';

/**
 * The arguments of an APIBuilder operation
 */
export class ApiBuilderOperationArgument {
  static fromSchema(config, service) {
    return new ApiBuilderOperationArgument(config, service);
  }

  config: any;
  service: any;

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

  get defaultValue(): string {
    return this.config.default;
  }

  get description(): string {
    return this.config.description;
  }

  get location() {
    return this.config.location;
  }

  get required(): boolean {
    return this.config.required;
  }
}
