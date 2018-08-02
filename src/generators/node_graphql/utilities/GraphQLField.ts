import invariant = require('invariant');
import { concat, matches } from 'lodash';
import { ApiBuilderField, isArrayType, isPrimitiveType } from '../../../utilities/apibuilder';
import { expandReference } from './reference';
import toGraphQLOutputType = require('./toGraphQLOutputType');

interface IConfig {
  type: string;
  isPrimitive: boolean;
  isListType: boolean;
  expandedReference: any;
  deprecationReason: string;
  description: string;
}

export default class GraphQLField {
  /**
   * Creates a GraphQLField from an ApiBuilderField.
   */
  public static fromApiBuilderField(field: ApiBuilderField) {
    return new GraphQLField({
      deprecationReason: field.deprecationReason,
      description: field.description,
      expandedReference: expandReference(field.type, field.service),
      isListType: isArrayType(field.type),
      isPrimitive: isPrimitiveType(field.type),
      type: toGraphQLOutputType(field.type, field.isRequired, field.service),
    });
  }

  private config: IConfig;

  constructor(config: IConfig) {
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

    if (!getter) {
      return { getter: null };
    }

    return {
      getter,
      isListType: this.isListType,
      isPrimitive: this.isPrimitive,
      pathParts: concat(
        getter.service.baseUrl,
        (getter.resourcePath + getter.path)
          .split('/')
          .filter(x => x.length > 0),
      ),
      queryParts: getter.arguments
        .filter(matches({ location: 'Query' })),
    };
  }

  get deprecationReason() {
    return this.config.deprecationReason;
  }

  get description() {
    return this.config.description;
  }
}
