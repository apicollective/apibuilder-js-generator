const invariant = require('invariant');
const toGraphQLOutputType = require('./toGraphQLOutputType');
const { isPrimitiveType } = require('../../../utilities/apibuilder/');
const { expandReference } = require('./reference');
const { concat, matches } = require('lodash');
const { get } = require('lodash/fp');

interface Config {
  type: string,
  isPrimitive: boolean,
  expandedReference: any,
  deprecationReason: string,
  description: string
}

class GraphQLField {
  config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  get type() {
    return this.config.type;
  }

  get isPrimitive() {
    return this.config.isPrimitive;
  }

  get isReference() {
    return !!this.config.expandedReference;
  }

  /** The operation needed to get the full resource */
  get referenceGetter() {
    invariant(this.isReference, 'Can only get full resource given a reference');

    const getter = this.config.expandedReference.getter;

    if (!getter)
      return { getter };

    return {
      getter,
      pathParts: concat(
        getter.service.baseUrl,
        (getter.resourcePath + getter.path)
          .split('/')
          .filter(x => x.length > 0),
      ),
      queryParts: getter.arguments
        .filter(matches({ location: 'Query' }))
        .map(get('name'))
    };
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
      type: toGraphQLOutputType(field.type, field.isRequired, field.service),
      isPrimitive: isPrimitiveType(field.type),
      expandedReference: expandReference(field.type, field.service),
      deprecationReason: field.deprecationReason,
      description: field.description,
    });
  }
}

module.exports = GraphQLField;
