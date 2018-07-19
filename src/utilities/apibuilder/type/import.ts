import { find, map, matchesProperty, overSome } from 'lodash';
import { ApiBuilderEnum, ApiBuilderModel, ApiBuilderType, ApiBuilderUnion } from '.';

function findTypeByName(types: ApiBuilderType[], name: string) {
  return find(types, overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseType', name),
  ]));
}

/**
 * An import in APIBuilder
 */
export class ApiBuilderImport {
  public static fromSchema(schema, service) {
    return new ApiBuilderImport(schema, service);
  }

  private schema: any;
  private service: any;

  constructor(schema, service) {
    this.schema = schema;
    this.service = service;
  }

  get namespace() {
    return this.schema.namespace;
  }

  get organizationKey() {
    return this.schema.organization.key;
  }

  get applicationKey() {
    return this.schema.application.key;
  }

  get version() {
    return this.schema.version;
  }

  get enums() {
    return map(this.schema.enums, (enumeration) => {
      const schema = { name: enumeration };
      return ApiBuilderEnum.fromSchema(schema, this.service, this.namespace);
    });
  }

  get models() {
    return map(this.schema.models, (model) => {
      const schema = { name: model };
      return ApiBuilderModel.fromSchema(schema, this.service, this.namespace);
    });
  }

  get unions() {
    return map(this.schema.unions, (union) => {
      const schema = { name: union };
      return ApiBuilderUnion.fromSchema(schema, this.service, this.namespace);
    });
  }

  public findEnumByName(name) {
    return findTypeByName(this.enums, name);
  }

  public findModelByName(name) {
    return findTypeByName(this.models, name);
  }

  public findUnionByName(name) {
    return findTypeByName(this.unions, name);
  }

  public toString() {
    return `${this.applicationKey}@${this.version}`;
  }
}
