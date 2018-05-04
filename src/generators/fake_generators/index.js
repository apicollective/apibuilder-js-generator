const DebugLogger = require('debug');
const curry = require('lodash/fp/curry');
const map = require('lodash/fp/map');
const Service = require('../../utilities/apibuilder/Service');

const generateFile = require('./generators/generate-file');

const debug = DebugLogger('fake_generators:main');

const generateFiles = curry((service, entities) => {
  debug(`generating files for ${entities.length} entities, service[${service.getApplicationKey()}]`);
  return map(generateFile(service), entities);
});

function generate(serviceData) {
  const service = new Service({ service: serviceData });

  const generatedFiles = generateFiles(service, service.getIndexed());
  const files = map(file => ({ name: file.path, contents: file.contents }), generatedFiles);

  return Promise.resolve(files);
}

module.exports = { generate };
