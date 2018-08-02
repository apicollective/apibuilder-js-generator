const invariant = require('invariant');
const fromPairs = require('lodash/fromPairs');

const { isModelType } = require('../../../utilities/apibuilder');
const { default: GraphQLField } = require('./GraphQLField');
const toDefaultExport = require('./toDefaultExport');

/**
 * @see http://graphql.org/graphql-js/type/#graphqlobjecttype
 */
class GraphQLObjectType {
  constructor(config) {
    invariant(config.name != null, 'Must provide a name.');
    this.config = config;
  }

  /** @property {!String} */
  get name() {
    return this.config.name;
  }

  /** @property {!Object.<String, GraphQLField>} */
  get fields() {
    return this.config.fields;
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /**
   * Create a GraphQLObjectType from a ApiBuilderModel.
   * @param {ApiBuilderModel} model
   */
  static fromApiBuilderModel(model) {
    invariant(isModelType(model), `"${String(model)} is not an API builder model.`);
    return new GraphQLObjectType({
      name: toDefaultExport(model),
      description: model.description,
      fields: fromPairs(model.fields.map(field => [
        field.name,
        GraphQLField.fromApiBuilderField(field),
      ])),
    });
  }
}

module.exports = GraphQLObjectType;
