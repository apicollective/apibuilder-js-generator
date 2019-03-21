const createLogger = require('debug');
const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');
const generateOpenApiSpec = require('./generators/openapi-spec');
const debug = createLogger('apibuilder:openapi');

function generate(invocationForm) {
  const service = new ApiBuilderService(invocationForm.service);
  const contents = generateOpenApiSpec(service);
  const file = new ApiBuilderFile('openapi.json', '', contents);

  return Promise.resolve([file]);
}

module.exports = { generate };