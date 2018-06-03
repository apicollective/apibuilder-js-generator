const { ApiBuilderService } = require('../../utilities/apibuilder');
const { generateFiles: generateSchemaFiles } = require('./generators/schema');
const { generateFiles: generateServerFiles } = require('./generators/server');

function generate(data) {
  const service = new ApiBuilderService({ service: data });

  let files = [];

  // Generate GraphQL Schema
  files = files.concat(generateSchemaFiles(service));
  // Generate GraphQL Server
  files = files.concat(generateServerFiles(service));

  return Promise.resolve(files);
}

module.exports = { generate };
