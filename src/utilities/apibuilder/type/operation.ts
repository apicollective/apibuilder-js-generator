import { flow, get, getOr, inRange } from 'lodash/fp';
import { ApiBuilderOperationArgument, astFromTypeName, typeFromAst } from '..';

/**
 * An APIBuilder operation, inside of a resource
 */
export class ApiBuilderOperation {
  public static fromSchema(config, resource, service) {
    return new ApiBuilderOperation(config, resource.path, service);
  }

  private config: any;
  private service: any;
  private resourcePath: string;

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

  get path(): string {
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

  get arguments(): ApiBuilderOperationArgument[] {
    return this.config.parameters.map(arg =>
      ApiBuilderOperationArgument.fromSchema(arg, this.service));
  }
}
