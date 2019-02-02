const createLogger = require('debug');
const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');
const get = require('lodash/get');
const map = require('lodash/map');
const omit = require('lodash/omit');
const pick = require('lodash/pick');
const reduce = require('lodash/reduce');
const groupBy = require('lodash/groupBy');
const mapValues = require('lodash/mapValues');
const flatten = require('lodash/flatten');

const debug = createLogger('apibuilder:openapi');

function extractOperation(resources) {
    const mapped = map(resources, resource => resource.operations);
    const flattened = flatten(mapped);
    return flattened;
}

function resourcesToPaths(resources) {
    const operations = extractOperation(resources);

    // sort by path
    const groupedOperations = groupBy(operations, (operation) => {
      return operation.path;
    });

    // debug(`grouped: ${JSON.stringify(groupedOperations)}`);

    // const filtered = mapValues(groupedOperations, (ops) => {
    //   return map(ops, (op) => omit(op, ['path']));
    // });

    // debug(`filtered ${JSON.stringify(filtered)}`);

    const paths = mapValues(groupedOperations, (operations) => {
    //   debug(`operations ${JSON.stringify(operations)}`);
      return reduce(operations, (props, operation, index) => {
        // debug('operation', index, JSON.stringify(operation));
        props[operation.method.toLowerCase()] = pick(operation, ['description']);
        return props;
      }, {});
    });

    return paths;
}

function generate(invocationForm) {
    const service = new ApiBuilderService(invocationForm.service);
    const info = {
        title: service.name,
        description: service.description,
        termsOfService: '',
        contact: get(service, 'info.contact', ''),
        license: get(service, 'info.license', ''),
        version: service.version,
    };

    const paths = resourcesToPaths(service.resources);

    const contents = {
       openapi: "3.0.2",
       info,
       paths,
    };

    const file = new ApiBuilderFile('openapi.json', '', contents);
    return Promise.resolve([file]);
}

module.exports = { generate };
