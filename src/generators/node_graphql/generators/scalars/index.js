const { ApiBuilderFile } = require('../../../../utilities/apibuilder');
const { destinationDirForScalars } = require('../../utilities/destinationPath');
const prettier = require('prettier');

function generateFiles(service) {
  const dirname = destinationDirForScalars(service);
  const basename = 'scalars.js';

  const contents = `
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLScalarType
} = require('graphql');

const { Kind } = require('graphql/language');

function checkObject(value) {
  if (typeof value !== 'object')
    throw new TypeError('not an object');

  if (Array.isArray(value))
    throw new TypeError('keys should be strings');

  return value;
}

exports.ApiBuilderObject = new GraphQLScalarType({
  name: 'Object',
  description: 'JSON object',
  serialize: checkObject,
  parseValue: checkObject,
  parseLiteral(ast) {
    console.log('parseLiteral', ast); // TODO
    throw new Error('parsing not implemented');
  }
});

exports.ApiBuilderJson = new GraphQLScalarType({
  name: 'JSON',
  description: 'any valid JSON type',
  serialize: x => x,
  parseValue: x => x,
  parseLiteral(ast) {
    console.log('parseLiteral', ast); // TODO
    throw new Error('parsing not implemented');
  }
});

function checkLong(value) {
  if (typeof value !== 'number')
    throw new TypeError(\`\${value} is not a number\`)

  if (!Number.isInteger(value))
    throw new TypeError(\`\${value} is not a long\`)

  return value
}

exports.ApiBuilderLong = new GraphQLScalarType({
  name: 'Long',
  serialize: checkLong,
  parseValue: checkLong,
  parseLiteral(ast) {
    console.log('parseLiteral', ast);
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10);
    }
  }
});

exports.ApiBuilderUnit = new GraphQLScalarType({
  name: 'Unit',
  serialize: () => null,
  parseValue: () => null,
  parseLiteral(ast) {
    console.log('parseLiteral', ast);
    throw new Error('parsing not implemented');
  }
})

const mapEntryCache = {};

// Creates types for map entries, of type string -> valueType
// It is memoized because we can't have multiple types with the same name
exports.makeMapEntry = function(valueType) {
  if (mapEntryCache[valueType.name])
    return mapEntryCache[valueType.name];
  const type = new GraphQLObjectType({
    name: \`StringTo\${valueType}\`,
    fields: {
      key: {
        type: GraphQLString,
      },
      value: {
        type: valueType
      }
    }
  });
  mapEntryCache[valueType.name] = type;
  return type;
};

exports.GraphQLDate = require('graphql-iso-date').GraphQLDate;
exports.GraphQLDateTime = require('graphql-iso-date').GraphQLDateTime;
`;

  const code = prettier.format(contents, {
    singleQuote: true,
    trailingComma: 'es5',
    parser: 'babylon',
  });

  return new ApiBuilderFile(basename, dirname, code);
}

exports.generateFiles = generateFiles;