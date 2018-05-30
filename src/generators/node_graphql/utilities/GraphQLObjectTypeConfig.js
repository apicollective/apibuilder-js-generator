const GraphQLFieldConfig = require('./GraphQLFieldConfig');
const toDefaultExport = require('./toDefaultExport');

/**
 * @see http://graphql.org/graphql-js/type/#graphqlobjecttype
 */
class GraphQLObjectTypeConfig {
  constructor(config) {
    Object.defineProperties(this, {
      /** @property {!String} */
      name: {
        enumerable: true,
        value: config.name,
      },
      /** @property {!Object.<String, GraphQLFieldConfig>} */
      fields: {
        enumerable: true,
        value: config.fields,
      },
      /** @property {?String} */
      description: {
        enumerable: true,
        value: config.description,
      },
    });
  }

  /**
   *
   * @param {ApiBuilderModel} model
   */
  static fromModel(model) {
    return new GraphQLObjectTypeConfig({
      name: toDefaultExport(model),
      fields: model.fields.reduce((fields, field) => Object.assign({}, fields, {
        [field.name]: GraphQLFieldConfig.fromField(field),
      }), {}),
      description: model.description,
    });
  }
}

module.exports = GraphQLObjectTypeConfig;
