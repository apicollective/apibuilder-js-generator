const find = require('lodash/find');
const overSome = require('lodash/overSome');
const map = require('lodash/map');
const matchesProperty = require('lodash/matchesProperty');

const ApiBuilderModel = require('./ApiBuilderModel');
const ApiBuilderEnum = require('./ApiBuilderEnum');
const ApiBuilderUnion = require('./ApiBuilderUnion');

function findTypeByName(types, name) {
  return find(types, overSome([
    matchesProperty('shortName', name),
    matchesProperty('baseType', name),
  ]));
}

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
    return map(this.schema.enums, (enumeration) => {
      const { namespace, service } = this;
      const schema = { name: enumeration };
      return ApiBuilderEnum.fromSchema(schema, service, namespace);
    });
  }

  get models() {
    return map(this.schema.models, (model) => {
      const { namespace, service } = this;
      const schema = { name: model };
      return ApiBuilderModel.fromSchema(schema, service, namespace);
    });
  }

  get unions() {
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
}

module.exports = ApiBuilderImport;
