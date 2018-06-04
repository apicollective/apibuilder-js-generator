const find = require('lodash/find');
const flatMap = require('lodash/flatMap');
const map = require('lodash/map');
const matchesProperty = require('lodash/matchesProperty');
const memoize = require('lodash/memoize');
const overSome = require('lodash/overSome');
const property = require('lodash/property');
const definition = require('./definition');
const resource = require('./resource');

function findTypeByName(types, name) {
  return find(types, overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseType', name),
  ]));
}

const mapToEnumType = memoize((schema, service, namespace) => {
  const { ApiBuilderEnum } = definition;
  return ApiBuilderEnum.fromSchema(schema, service, namespace);
});

const mapToModelType = memoize((schema, service, namespace) => {
  const { ApiBuilderModel } = definition;
  return ApiBuilderModel.fromSchema(schema, service, namespace);
});

const mapToUnionType = memoize((schema, service, namespace) => {
  const { ApiBuilderUnion } = definition;
  return ApiBuilderUnion.fromSchema(schema, service, namespace);
});

class ApiBuilderImport {
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
    const { ApiBuilderEnum } = definition;
    return map(this.schema.enums, (enumeration) => {
      const { namespace, service } = this;
      const schema = { name: enumeration };
      return ApiBuilderEnum.fromSchema(schema, service, namespace);
    });
  }

  get models() {
    const { ApiBuilderModel } = definition;
    return map(this.schema.models, (model) => {
      const { namespace, service } = this;
      const schema = { name: model };
      return ApiBuilderModel.fromSchema(schema, service, namespace);
    });
  }

  get unions() {
    const { ApiBuilderUnion } = definition;
    return map(this.schema.unions, (union) => {
      const { namespace, service } = this;
      const schema = { name: union };
      return ApiBuilderUnion.fromSchema(schema, service, namespace);
    });
  }

  findEnumByName(name) {
    return findTypeByName(this.enums, name);
  }

  findModelByName(name) {
    return findTypeByName(this.models, name);
  }

  findUnionByName(name) {
    return findTypeByName(this.unions, name);
  }

  toString() {
    return `${this.applicationKey}@${this.version}`;
  }

  static fromSchema(schema, service) {
    return new ApiBuilderImport(schema, service);
  }
}

exports.ApiBuilderImport = ApiBuilderImport;

/**
 * Wraps an apibuilder service definition and provides utilities for
 * interacting with it.
 */
class ApiBuilderService {
  constructor({ service: schema }) {
    this.schema = schema;
  }

  get name() {
    return this.schema.name;
  }

  get namespace() {
    return this.schema.namespace;
  }

  get version() {
    return this.schema.version;
  }

  get applicationKey() {
    return this.schema.application.key;
  }

  get organizationKey() {
    return this.schema.organization.key;
  }

  get imports() {
    return map(this.schema.imports, schema =>
      ApiBuilderImport.fromSchema(schema, this));
  }

  get enums() {
    return [
      ...this.internalEnums,
      ...this.externalEnums,
    ];
  }

  get models() {
    return [
      ...this.internalModels,
      ...this.externalModels,
    ];
  }

  get unions() {
    return [
      ...this.internalUnions,
      ...this.externalUnions,
    ];
  }

  get types() {
    return [
      ...this.internalTypes,
      ...this.externalTypes,
    ];
  }

  get internalEnums() {
    return map(this.schema.enums, enumeration =>
      mapToEnumType(enumeration, this));
  }

  get internalModels() {
    return map(this.schema.models, model =>
      mapToModelType(model, this));
  }

  get internalUnions() {
    return map(this.schema.unions, union =>
      mapToUnionType(union, this));
  }

  get internalTypes() {
    return [
      ...this.internalEnums,
      ...this.internalModels,
      ...this.internalUnions,
    ];
  }

  get externalEnums() {
    return flatMap(this.imports, property('enums'));
  }

  get externalModels() {
    return flatMap(this.imports, property('models'));
  }

  get externalUnions() {
    return flatMap(this.imports, property('unions'));
  }

  get externalTypes() {
    return [
      ...this.externalEnums,
      ...this.externalModels,
      ...this.externalUnions,
    ];
  }

  get resources() {
    const { ApiBuilderResource } = resource;
    return map(this.schema.resources, resource => new ApiBuilderResource(resource, this));
  }

  findModelByName(name) {
    return findTypeByName(this.models, name);
  }

  findEnumByName(name) {
    return findTypeByName(this.enums, name);
  }

  findUnionByName(name) {
    return findTypeByName(this.unions, name);
  }

  toString() {
    return `${this.applicationKey}@${this.version}`;
  }
}

exports.ApiBuilderService = ApiBuilderService;
