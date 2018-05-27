const toGraphQLOutputType = require('./toGraphQLOutputType');

class GraphQLFieldConfig {
  constructor(config) {
    Object.defineProperties(this, {
      type: {
        enumerable: true,
        value: config.type,
      },
      args: {
        enumerable: true,
        value: config.args,
      },
      resolve: {
        enumerable: true,
        resolve: config.resolve,
      },
      deprecationReason: {
        enumerable: true,
        value: config.deprecationReason,
      },
      description: {
        enumerable: true,
        value: config.description,
      },
    });
  }

  /**
   * Creates a GraphQLFieldConfig from an ApiBuilderField.
   * @param {ApiBuilderField} field
   */
  static fromField(field) {
    return new GraphQLFieldConfig({
      type: toGraphQLOutputType(field.type, field.isRequired),
      deprecationReason: field.deprecationReason,
      description: field.description,
    });
  }
}

module.exports = GraphQLFieldConfig;
