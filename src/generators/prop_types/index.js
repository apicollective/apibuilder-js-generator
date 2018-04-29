const DebugLogger = require('debug');
const curry = require('lodash/fp/curry');
const map = require('lodash/fp/map');
const Service = require('../../utilities/apibuilder/Service');

const generatePropTypeFile = require('./generators/generate-prop-type-file');

const debug = DebugLogger('prop_types:main');

const generateFiles = curry((service, entities) => {
  debug(`generating files for ${entities.length} entities, service[${service.getApplicationKey()}]`);
  return map(generatePropTypeFile(service), entities);
});

function generate(serviceData) {
  const service = new Service({ service: serviceData });

  const generatedFiles = generateFiles(service, service.getIndexed());
  const files = map(file => ({ name: file.path, contents: file.contents }), generatedFiles);

  return Promise.resolve(files);
}

module.exports = { generate };
