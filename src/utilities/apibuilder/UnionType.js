const Entity = require('./Entity');

/** @see https://app.apibuilder.io/bryzek/apidoc-spec/0.11.94#model-union_type */
class UnionType {
  constructor(config, service) {
    Object.defineProperties(this, {
      /** @property {!Entity} */
      type: {
        enumerable: true,
        value: Entity.fromType(config.type, service),
      },
      /** @property {?String} */
      description: {
        enumerable: true,
        value: config.description,
      },
      /** @property {?Object} */
      deprecation: {
        enumerable: true,
        value: config.deprecation,
      },
      /** @property {!Object[]} */
      attributes: {
        enumerable: true,
        value: config.attributes,
      },
      /** @property {?Boolean} */
      default: {
        enumerable: true,
        value: config.default,
      },
    });
  }
}

module.exports = UnionType;
