const { ApiBuilderService } = require('../../utilities/apibuilder');
const { generateFile: generateEnumFile } = require('./generators/enumeration');
const { generateFile: generateModelFile } = require('./generators/model');
const { generateFile: generateUnionFile } = require('./generators/union'); 
const { generateFile: generateSchemaFile } = require('./generators/schema'); 
const { generateFiles: generateScalars } = require('./generators/scalars');

function generate(data) {
  const service = new ApiBuilderService({ service: data });

  let files = [];

  // Generate GraphQL Schema Types
  files = files.concat(service.internalEnums.map(generateEnumFile));
  files = files.concat(service.internalModels.map(generateModelFile));
  files = files.concat(service.internalUnions.map(generateUnionFile)); 
  files = files.concat(generateSchemaFile(service));
  files = files.concat(generateScalars(service));

  require('debug')('apibuilder:graphql')('✅ done');

  return Promise.resolve(files);
}

module.exports = { generate };
