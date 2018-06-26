const invariant = require('invariant');

const { isModelType, isUnionType, isEnumType } = require('../../../utilities/apibuilder');
const GraphQLObjectType = require('./GraphQLObjectType');
const GraphQLEnumType = require('./GraphQLEnumType');
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

  get models() {
    return this.config.models;
  }

  get enums() {
    return this.config.enums;
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

    // TODO: support scalars? unions in unions?
    return new GraphQLUnionType({
      name: pascalCase(union.shortName),
      models: union.types.map(t => t.type).filter(isModelType).map(GraphQLObjectType.fromApiBuilderModel),
      enums: union.types.map(t => t.type).filter(isEnumType).map(GraphQLEnumType.fromApiBuilderEnum),
    });
  }
}

module.exports = GraphQLUnionType;
