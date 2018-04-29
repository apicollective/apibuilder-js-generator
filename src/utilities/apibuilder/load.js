const https = require('https');
const DebugLogger = require('debug');

const Service = require('./Service');

const debug = DebugLogger('apibuilder:load');

/**
 * Load a service from the apibuilder API.
 *
 * @param {Object} options -
 * @param {String} options.organization - The apibuilder organization
 * @param {String} options.service - The service application key
 * @param {String} options.version - Default: latest. The service version.
 * @param {String} options.authToken - If loading a private service, the auth token from an
 *                                     apibuilder user account
 * @param {Boolean} options.loadImports - Whether or not to load imported services.
 */
function load({
  organization, service, version = 'latest', authToken, loadImports,
}) {
  debug(`Fetching service[${service}] version[${version}]`);
  return new Promise((resolve, reject) => {
    const httpOptions = {
      hostname: 'api.apibuilder.io',
      port: '443',
      path: `/${organization}/${service}/${version}`,
      method: 'GET',
    };

    if (authToken) {
      httpOptions.auth = `${authToken}:`;
    }

    const request = https.request(httpOptions, (res) => {
      res.setEncoding('utf8');

      const { statusCode } = res;
      const contentType = res.headers['content-type'];

      let error;
      if (statusCode === 303) {
        error = new Error(`Could not load data for service[${service}]. authToken option is required. Get your auth token from https://app.apibuilder.io/tokens/`);
      } else if (statusCode !== 200) {
        error = new Error(`Could not load data for service[${service}]. Request Failed.\n` +
                          `Status Code: ${statusCode}`);
      } else if (!/^application\/json/.test(contentType)) {
        error = new Error(`Could not load data for service[${service}]. Invalid content-type.\n` +
                          `Expected application/json but received ${contentType}`);
      }

      if (error) {
        reject(error);
        // consume response data to free up memory
        res.resume();
        return;
      }

      let body = '';
      res.on('data', (data) => {
        body += data;
      });
      res.on('end', () => {
        const serviceJson = JSON.parse(body);

        if (loadImports && serviceJson.service.imports && serviceJson.service.imports.length) {
          const importPromises = serviceJson.service.imports.map(imp => load({
            organization: imp.organization.key,
            service: imp.application.key,
            version: imp.version,
            authToken,
            loadImports: false,
          }));
          Promise
            .all(importPromises)
            .then(resolvedImports => resolve(new Service(serviceJson, resolvedImports)));
        } else {
          resolve(new Service(serviceJson));
        }
      });
    }).on('error', reject);

    request.end();
  });
}

module.exports = load;
