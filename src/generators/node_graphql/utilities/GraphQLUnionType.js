const invariant = require('invariant');
const { conforms } = require('lodash');

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

  get discriminator() {
    return this.config.discriminator;
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
      discriminator: union.discriminator,
      models: union.types.filter(conforms({ type: isModelType })).map(({ discriminatorValue, type }) => ({
        discriminatorValue,
        type: GraphQLObjectType.fromApiBuilderModel(type),
      })),
      enums: union.types.filter(conforms({ type: isEnumType })).map(({ discriminatorValue, type }) => ({
        discriminatorValue,
        type: GraphQLEnumType.fromApiBuilderEnum(type),
        isEnum: true,
      })),
    });
  }
}

module.exports = GraphQLUnionType;
