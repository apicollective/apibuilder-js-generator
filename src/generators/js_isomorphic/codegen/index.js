const generateLoggerFile = require('./files/logger');
const generateClientFile = require('./files/client');
const generateIndexFile = require('./files');
const generateResourceFile = require('./files/resource');

const defaultOpts = {
  /**
   * Path to `client.js` relative to generated resource javascript files. Useful when
   * generating clients from multiple services to share a single client class.
   *
   * @type {String}
   */
  clientImportPath: '.',
};

/**
 * Generate code for the given service.
 *
 * @param  {Object} service            Object representation of the apidoc
 *                                     service
 * @param  {Object} [opts=defaultOpts] Configuration options for code generation
 * @return {Object}                    Object containing file contents
 *                  files.contents     File contents
 *                  files.path         Path (recommended) of the file
 */
function generate(service, opts = defaultOpts) {
  const staticFiles = [
    generateLoggerFile(),
    generateClientFile(),
    generateIndexFile(service),
  ];

  const resourceFiles = service.resources.map(
    (resource) => generateResourceFile(resource, service.name, opts.clientImportPath),
  );

  const files = staticFiles.concat(resourceFiles);

  return { files };
}

module.exports = { generate };
