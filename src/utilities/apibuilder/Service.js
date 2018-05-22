const flatMap = require('lodash/flatMap');
const map = require('lodash/map');
const memoize = require('lodash/memoize');

const Enumeration = require('./Enumeration');
const Model = require('./Model');
const Union = require('./Union');

/**
 * @class Service
 * Wraps an apibuilder service definition and provides utilities for interacting with it.
 */
class Service {
  constructor({ service: schema }) {
    Object.defineProperty(this, 'schema', {
      enumerable: true,
      value: schema,
    });

    Object.defineProperty(this, 'name', {
      enumerable: true,
      value: this.schema.name,
    });

    Object.defineProperty(this, 'namespace', {
      enumerable: true,
      value: this.schema.namespace,
    });

    Object.defineProperty(this, 'version', {
      enumerable: true,
      value: this.schema.version,
    });

    Object.defineProperty(this, 'applicationKey', {
      enumerable: true,
      value: this.schema.application.key,
    });

    Object.defineProperty(this, 'organizationKey', {
      enumerable: true,
      value: this.schema.organization.key,
    });

    Object.defineProperty(this, 'enums', {
      get() {
        return [
          ...this.internalEnums,
          ...this.externalEnums,
        ];
      },
    });

    Object.defineProperty(this, 'models', {
      get() {
        return [
          ...this.internalModels,
          ...this.externalModels,
        ];
      },
    });

    Object.defineProperty(this, 'unions', {
      get() {
        return [
          ...this.internalUnions,
          ...this.externalUnions,
        ];
      },
    });

    Object.defineProperty(this, 'entities', {
      get() {
        return [
          ...this.internalEntities,
          ...this.externalEntities,
        ];
      },
    });

    Object.defineProperty(this, 'internalEnums', {
      get: memoize(() =>
        map(this.schema.enums, enumeration => Enumeration.fromSchema(enumeration, this))),
    });

    Object.defineProperty(this, 'internalModels', {
      get: memoize(() =>
        map(this.schema.models, model => Model.fromSchema(model, this))),
    });

    Object.defineProperty(this, 'internalUnions', {
      get: memoize(() =>
        map(this.schema.unions, union => Union.fromSchema(union, this))),
    });

    Object.defineProperty(this, 'internalEntities', {
      get() {
        return [
          ...this.internalEnums,
          ...this.internalModels,
          ...this.internalUnions,
        ];
      },
    });

    Object.defineProperty(this, 'externalEnums', {
      get: memoize(() => flatMap(this.schema.imports, ({ enums, namespace }) =>
        map(enums, enumeration => Enumeration.fromSchema({ name: enumeration }, this, namespace)))),
    });

    Object.defineProperty(this, 'externalModels', {
      get: memoize(() => flatMap(this.schema.imports, ({ models, namespace }) =>
        map(models, model => Model.fromSchema({ name: model }, this, namespace)))),
    });

    Object.defineProperty(this, 'externalUnions', {
      get: memoize(() => flatMap(this.schema.imports, ({ unions, namespace }) =>
        map(unions, union => Union.fromSchema({ name: union }, this, namespace)))),
    });

    Object.defineProperty(this, 'externalEntities', {
      get() {
        return [
          ...this.externalEnums,
          ...this.externalModels,
          ...this.externalUnions,
        ];
      },
    });
  }
}

module.exports = Service;
