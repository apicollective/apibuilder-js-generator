const invariant = require('invariant');

const { isModelType } = require('../../../utilities/apibuilder');
const GraphQLFieldConfig = require('./GraphQLFieldConfig');
const toDefaultExport = require('./toDefaultExport');

/**
 * @see http://graphql.org/graphql-js/type/#graphqlobjecttype
 */
class GraphQLObjectTypeConfig {
  constructor(config) {
    this.config = config;
  }

  /** @property {!String} */
  get name() {
    return this.config.name;
  }

  /** @property {!Object.<String, GraphQLFieldConfig>} */
  get fields() {
    return this.config.fields;
  }

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /**
   * Create a GraphQLObjectTypeConfig from a ApiBuilderModel.
   * @param {ApiBuilderModel} model
   */
  static fromApiBuilderModel(model) {
    invariant(isModelType(model), `"${String(model)} is not an API builder model.`);
    return new GraphQLObjectTypeConfig({
      name: toDefaultExport(model),
      description: model.description,
      fields: model.fields.reduce((fields, field) => Object.assign({}, fields, {
        [field.name]: GraphQLFieldConfig.fromField(field),
      }), {}),
    });
  }
}

module.exports = GraphQLObjectTypeConfig;
