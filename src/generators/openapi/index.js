const createLogger = require('debug');
const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');
const generateOpenApiSpec = require('./generators/openapi-spec/generateOpenApiSpec').default;
/* uncomment for debugging */
// const debug = createLogger('apibuilder:openapi');

function generate(invocationForm) {
  const service = new ApiBuilderService(invocationForm.service);
  const contentsData = generateOpenApiSpec(service);
  const contents = JSON.stringify(contentsData, null, 2);
  const file = new ApiBuilderFile('openapi.json', '', contents);

  return Promise.resolve([file]);
}

module.exports = { generate };
