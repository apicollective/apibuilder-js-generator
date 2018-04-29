const filter = require('lodash/fp/filter');
const identity = require('lodash/fp/identity');
const loadService = require('../../../utilities/apibuilder/load');

function getOrganization(settings = {}) {
  let setting = settings.envApiBuilderOrganization || process.env.ENV_API_BUILDER_ORGANIZATION || 'flow';

  if (!setting) {
    console.log('[WARNING] Could not determine apibuilder organization. Either pass it in as the `envApiBuilderOrganization` setting or set the ENV_API_BUILDER_ORGANIZATION environment variable. Defaulting to \'flow\'');
    setting = 'flow';
  }

  return setting;
}

function getToken(settings = {}) {
  const setting = settings.envApiBuilderToken || process.env.ENV_API_BUILDER_TOKEN;

  if (!setting) {
    console.log('[WARNING] Could not determine apibuilder auth token. Either pass it in as the `envApiBuilderToken` setting or set the ENV_API_BUILDER_TOKEN environment variable.');
  }

  return setting;
}

/**
 * Fetch apibuilder services from app.apibuilder.io.
 *
 * @param {Array[String]} apis - an array of apibuilder service application keys
 *
 * @returns {Promise} - array of Service objects
 */
async function fetchServices(apis, settings) {
  const fetching = apis.map(api => loadService({
    organization: getOrganization(settings),
    service: api,
    authToken: getToken(settings),
    loadImports: true,
  }).catch((error) => {
    console.error('failed to load service', error);
  }));

  const fetched = await Promise.all(fetching);
  return filter(identity, fetched);
}

module.exports = fetchServices;
