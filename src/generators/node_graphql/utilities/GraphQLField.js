const toGraphQLOutputType = require('./toGraphQLOutputType');

class GraphQLField {
  constructor(config) {
    this.config = config;
  }

  get type() {
    return this.config.type;
  }

  get args() {
    return this.config.args;
  }

  get resolve() {
    return this.config.resolve;
  }

  get deprecationReason() {
    return this.config.deprecationReason;
  }

  get description() {
    return this.config.description;
  }

  /**
   * Creates a GraphQLField from an ApiBuilderField.
   * @param {ApiBuilderField} field
   * @returns {GraphQLField}
   */
  static fromApiBuilderField(field) {
    return new GraphQLField({
      type: toGraphQLOutputType(field.type, field.isRequired),
      deprecationReason: field.deprecationReason,
      description: field.description,
    });
  }
}

module.exports = GraphQLField;
