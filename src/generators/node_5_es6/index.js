const path = require('path');
const fs = require('fs');
const hbs = require('hbs');
const camelCase = require('lodash/camelCase');

const { capitalizeFirstLetter } = require('./utils');

const UTILS_TEMPLATE_LOCATION = path.resolve(__dirname, './templates/utils.hbs');
const CLIENT_TEMPLATE_LOCATION = path.resolve(__dirname, './templates/client.hbs');
const RESOURCE_TEMPLATE_LOCATION = path.resolve(__dirname, './templates/resource.hbs');

function getClientTemplate() {
  return hbs.handlebars.compile(fs.readFileSync(CLIENT_TEMPLATE_LOCATION).toString('utf-8'));
}

function getResourceTemplate() {
  return hbs.handlebars.compile(fs.readFileSync(RESOURCE_TEMPLATE_LOCATION).toString('utf-8'));
}

function getUtilsTemplate() {
  return hbs.handlebars.compile(fs.readFileSync(UTILS_TEMPLATE_LOCATION).toString('utf-8'));
}

function getGeneratorDescription() {
  return 'Node 5 apibuilder client';
}

/* private */
function getPathParameters(operation) {
  return operation.parameters.filter(param => param.location === 'Path');
}

/* private */
function getQueryParameters(operation) {
  return operation.parameters.filter(param => param.location === 'Query');
}

function requestCanHaveBody(method) {
  const m = method.toUpperCase();
  return m === 'POST' || m === 'PUT' || m === 'PATCH';
}

function getFunctionParamsStr(operation) {
  const params = getPathParameters(operation).map(p => camelCase(p.name));
  return params.concat(['options']).join(', ');
}

/**
 * Turn 'GET /:id/passengers' into 'getPassengersById'
 */
function getFunctionName(operation, resourcePath) {
  if (operation.path) {
    let pathWithOutPrefix = operation.path.replace(resourcePath, '');

    if (pathWithOutPrefix.startsWith('/')) {
      pathWithOutPrefix = pathWithOutPrefix.slice(1);
    }

    const parts = pathWithOutPrefix.split('/');
    const variableParts = parts
      .filter(p => p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? 'By' : 'And';
        return prefix + capitalizeFirstLetter(part.slice(1));
      });

    const staticParts = parts
      .filter(p => !p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? '' : 'And';
        return prefix + capitalizeFirstLetter(part);
      });

    const sortedParts = staticParts.concat(variableParts);

    return operation.method.toLowerCase() + sortedParts.join('');
  }

  return operation.method.toLowerCase();
}

function getEndpointUriStr(operation) {
  const START_LITERAL = '${';
  const END_LITERAL = '}';
  const fullPath = operation.path.slice(1);
  const parts = fullPath.split('/')
    .map((part) => {
      if (part.indexOf(':') === 0) {
        return `/${START_LITERAL}${camelCase(part.slice(1))}${END_LITERAL}`;
      }
      return `/${part}`;
    });

  return `${parts.join('')}`;
}

function getQueryParameterNames(operation) {
  return getQueryParameters(operation).map(param => ({
    name: param.name,
    nameCamelCase: camelCase(param.name),
  }));
}

function getDeclaredResponses(operation) {
  return operation.responses
    .filter(response => response.code && response.code.integer)
    .map((response) => {
      const status = response.code.integer.value;
      return {
        code: status,
        type: response.type,
        isUnitType: response.type === 'unit',
        isResolve: status >= 200 && status < 300,
      };
    });
}

function isApplicationJson(operation) {
  return !!operation.body;
}

function isFormUrlEncoded(operation) {
  return !isApplicationJson(operation) && requestCanHaveBody(operation.method);
}

function getBodyType(operation) {
  if (!operation.body) {
    return undefined;
  }

  const maybeType = operation.body.type;
  return maybeType.startsWith('[]') ? maybeType.slice(1).slice(0, -1) : maybeType;
}

function getDiscriminatorForBody(operation, service) {
  if (!operation.body) {
    return undefined;
  }

  const bodyType = getBodyType(operation);
  const unionType = service.unions.find(u => u.name === bodyType);

  if (unionType) {
    return unionType.discriminator;
  }

  return undefined;
}

function getOperationSettings(operation, service) {
  return {
    requiresBody: !!operation.body || requestCanHaveBody(operation.method),
    bodyType: getBodyType(operation),
    discriminator: getDiscriminatorForBody(operation, service),
    queryParams: getQueryParameterNames(operation),
    isApplicationJson: isApplicationJson(operation),
    isFormUrlEncoded: isFormUrlEncoded(operation),
    method: operation.method,
  };
}

function getOperations(operations, resourcePath, service) {
  return operations.map(operation => ({
    functionName: getFunctionName(operation, resourcePath),
    functionParams: getFunctionParamsStr(operation),
    endpointUriStr: getEndpointUriStr(operation),
    responses: getDeclaredResponses(operation),
    settingsJson: JSON.stringify(getOperationSettings(operation, service), null, 2),
  }));
}

function createResources(service) {
  const template = getResourceTemplate();

  return service.resources.map((resource) => {
    const resourceFile = {
      name: `${resource.plural}.js`,
      contents: template({
        plural: `${capitalizeFirstLetter(camelCase(resource.plural))}`,
        operations: getOperations(resource.operations, resource.path, service),
      }),
    };

    return resourceFile;
  });
}

function createPackageFile(service) {
  const json = {
    name: service.name,
    version: service.version.toString(),
    main: 'client.js',
    description: getGeneratorDescription(),
    author: 'apidoc.me',
  };

  return {
    name: 'package.json',
    contents: JSON.stringify(json, null, 2),
  };
}

function generate({ service }) {
  const template = getClientTemplate();
  const utilsTemplate = getUtilsTemplate();
  const resourceFiles = createResources(service);
  const clientModel = {
    enumsJson: JSON.stringify(service.enums),
    unionsJson: JSON.stringify(service.unions),
    resources: service.resources.map(r => ({
      className: capitalizeFirstLetter(camelCase(r.plural)),
      fileName: r.plural,
    })),
  };

  const clientFile = {
    name: 'client.js',
    contents: template(clientModel),
  };

  const utilsFile = {
    name: 'utils.js',
    contents: utilsTemplate(clientModel),
  };

  const files = [clientFile, utilsFile, createPackageFile(service)].concat(resourceFiles);

  return Promise.resolve(files);
}

module.exports = { generate };
