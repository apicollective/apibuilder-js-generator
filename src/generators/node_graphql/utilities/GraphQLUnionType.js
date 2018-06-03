const invariant = require('invariant');
const map = require('lodash/map');

const { isModelType, isUnionType } = require('../../../utilities/apibuilder');
const GraphQLObjectTypeConfig = require('./GraphQLObjectTypeConfig');
const pascalCase = require('../utilities/pascalCase');

class GraphQLUnionType {
  constructor(config) {
    this.config = config;
  }

  get name() {
    return this.config.name;
  }

  get types() {
    return this.config.types;
  }

  get resolveType() {
    return this.config.resolveType;
  }

  get description() {
    return this.config.description;
  }

  /**
   * Create a GraphQLUnionType from an ApiBuilderUnion object.
   * @param {ApiBuilderUnion} union
   */
  static fromApiBuilderUnion(union) {
    invariant(isUnionType(union), `"${String(union)}" is not an APIBuilderUnion type.`);

    return new GraphQLUnionType({
      name: pascalCase(union.shortName),
      types: map(union.types, (unionType) => {
        const { type } = unionType;

        // TODO: An API builder union type accepts either an enum, model, or a
        // primitive type. However, a GraphQLUnionType may only consist of
        // GraphQLObjectType which can only be derived from an API builder
        // model at the moment.
        invariant(isModelType(type), `"${String(type)}" cannot be transformed into a GraphQLObjectType.`);

        return GraphQLObjectTypeConfig.fromApiBuilderModel(type);
      }),
    });
  }
}

module.exports = GraphQLUnionType;
