const { ApiBuilderService } = require('../../utilities/apibuilder');
const { generateFiles: generateSchemaFiles } = require('./generators/schema');

function generate(data) {
  const service = new ApiBuilderService({ service: data });

  let files = [];

  // Generate GraphQL Schema
  files = files.concat(generateSchemaFiles(service));

  return Promise.resolve(files);
}

module.exports = { generate };
