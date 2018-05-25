const invariant = require('invariant');

const GraphQLEnumValueConfig = require('./GraphQLEnumValueConfig');
const constantCase = require('./constantCase');
const pascalCase = require('./pascalCase');

class GraphQLEnumTypeConfig {
  constructor(config = {}) {
    invariant(config.name != null, 'name property must be non nullable');
    invariant(config.values != null, 'values property must be non nullable');

    Object.defineProperties(this, {
      /** @property {!String} */
      name: {
        enumerable: true,
        value: config.name,
      },
      /** @property {!Object.<String,GraphQLEnumValueConfig>} */
      values: {
        enumerable: true,
        value: config.values,
      },
      /** @property {?String} */
      description: {
        enumerable: true,
        value: config.description,
      },
    });
  }

  /**
   * Creates a GraphQLEnumTypeConfig from a API Builder Enumeration instance.
   * @param {Enumeration} enumeration
   */
  static fromEnum(enumeration) {
    return new GraphQLEnumTypeConfig({
      name: pascalCase(enumeration.name),
      description: enumeration.description,
      values: enumeration.values.reduce((values, value) => Object.assign({}, values, {
        [constantCase(value.name)]: GraphQLEnumValueConfig.fromEnumValue(value),
      }), {}),
    });
  }
}

module.exports = GraphQLEnumTypeConfig;
