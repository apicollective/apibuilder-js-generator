import invariant = require('invariant');
import toGraphQLOutputType = require('./toGraphQLOutputType');
import { isPrimitiveType, isArrayType, ApiBuilderField } from '../../../utilities/apibuilder';
import { expandReference } from './reference';
import { concat, matches } from 'lodash';
import { get } from 'lodash/fp';

interface Config {
  type: string,
  isPrimitive: boolean,
  isListType: boolean,
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

  get isListType() {
    return this.config.isListType;
  }

  get isReference() {
    return !!this.config.expandedReference;
  }

  /** The operation needed to get the full resource */
  get referenceGetter() {
    invariant(this.isReference, 'Can only get full resource given a reference');

    const getter = this.config.expandedReference.getter;

    if (!getter)
      return { getter: null };

    return {
      getter,
      isPrimitive: this.isPrimitive,
      isListType: this.isListType,
      pathParts: concat(
        getter.service.baseUrl,
        (getter.resourcePath + getter.path)
          .split('/')
          .filter(x => x.length > 0),
      ),
      queryParts: getter.arguments
        .filter(matches({ location: 'Query' }))
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
   */
  static fromApiBuilderField(field: ApiBuilderField) {
    return new GraphQLField({
      type: toGraphQLOutputType(field.type, field.isRequired, field.service),
      isPrimitive: isPrimitiveType(field.type),
      isListType: isArrayType(field.type),
      expandedReference: expandReference(field.type, field.service),
      deprecationReason: field.deprecationReason,
      description: field.description,
    });
  }
}

module.exports = GraphQLField;
