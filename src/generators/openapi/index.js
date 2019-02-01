const createLogger = require('debug');
const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');

const debug = createLogger('apibuilder:openapi');

function generate(invocationForm) {
    const service = new ApiBuilderService(invocationForm.service);
    const info = {
        title: service.name,
        description: service.description,
        termsOfService: '',
        contact: service.info.contact,
        license: service.info.license,
        version: service.version,
    };
    const contents = {
       openapi: "3.0.2",
       info,
    };

    const file = new ApiBuilderFile('openapi.json', '', contents);
    return Promise.resolve([file]);
}

module.exports = { generate };
