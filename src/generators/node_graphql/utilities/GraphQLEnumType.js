const invariant = require('invariant');
const fromPairs = require('lodash/fromPairs');

const GraphQLEnumValue = require('./GraphQLEnumValue');
const constantCase = require('./constantCase');
const pascalCase = require('./pascalCase');

class GraphQLEnumType {
  constructor(config = {}) {
    invariant(config.name != null, 'name property must be non nullable');
    invariant(config.values != null, 'values property must be non nullable');
    this.config = config;
  }

  /** @property {!String} */
  get name() {
    return this.config.name;
  }

  /** @property {!Object.<String,GraphQLEnumValue>} */
  get values() {
    return this.config.values;
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /**
   * Creates a GraphQLEnumType from an ApiBuilderEnum.
   * @param {ApiBuilderEnum} enumeration
   * @returns {GraphQLEnumType}
   */
  static fromApiBuilderEnum(enumeration) {
    // TODO: Validate argument is actually an ApiBuilderEnum instance.
    return new GraphQLEnumType({
      name: pascalCase(enumeration.name),
      description: enumeration.description,
      values: fromPairs(enumeration.values.map(value => [
        constantCase(value.name),
        GraphQLEnumValue.formApiBuilderEnumValue(value),
      ])),
    });
  }
}

module.exports = GraphQLEnumType;
