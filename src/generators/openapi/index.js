const createLogger = require('debug');
const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');

function generate(invocationForm) {
    const contents = {
        foo: 'bar',
    };

    const file = new ApiBuilderFile('foo', '', contents);
    return Promise.resolve([file]);
}

module.exports = { generate };
