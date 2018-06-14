const { ApiBuilderFile } = require('../../../../utilities/apibuilder');
const { destinationDirForScalars } = require('../../utilities/destinationPath');
const prettier = require('prettier');

function generateFiles(service) {
  const dirname = destinationDirForScalars(service);
  const basename = 'scalars.js';

  const contents = `
const {
  GraphQLObjectType,
  GraphQLString
} = require('graphql');

function makeMapEntry(valueType) {
  return new GraphQLObjectType({
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
}

exports.makeMapEntry = makeMapEntry;
`;

  const code = prettier.format(contents, {
    singleQuote: true,
    trailingComma: 'es5',
    parser: 'babylon',
  });

  return new ApiBuilderFile(basename, dirname, code);
}

exports.generateFiles = generateFiles;