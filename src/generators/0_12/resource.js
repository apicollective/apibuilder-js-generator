const camelCase = require('lodash/camelCase');

const { alphaNumOnly, capitalizeFirstLetter } = require('./utils');

function getResourceObjectName(plural) {
  return capitalizeFirstLetter(camelCase(plural));
}

function getJSDocType(apiDocType) {
  let isArray = false;
  let paramType = apiDocType;

  if (apiDocType.indexOf('[') === 0) {
    isArray = true;
    paramType = apiDocType.slice(1, -1);
  }

  function typeOrArrayType(type) {
    return isArray ? `${type}[]` : type;
  }

  switch (paramType) {
    case 'boolean':
      return typeOrArrayType('boolean');
    case 'decimal':
    case 'double':
    case 'integer':
    case 'long':
      return typeOrArrayType('number');
    case 'date-iso8601':
    case 'date-time-iso8601':
    case 'string':
    case 'uuid':
      return typeOrArrayType('string');
    case 'object':
      return typeOrArrayType('Object');
    case 'unit':
      return 'undefined';
    default:
      return '*';
  }
}

function getDeclaredResponses(operation) {
  return operation.responses
    .filter((response) => response.code && response.code.integer)
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

function getPathStringBuilder(pathRoot, operation) {
  const SINGLE_QUOTE = '\'';
  const PLUS = '+';
  const PATH_DELIMETER = '/';
  const SPACE = ' ';

  let finalPathStr = SINGLE_QUOTE;
  const fullPath = operation.path.slice(1);
  const parts = fullPath.split('/')
    .map((part) => {
      if (part.indexOf(':') === 0) {
        // eslint-disable-next-line max-len
        return [
          PATH_DELIMETER,
          SINGLE_QUOTE,
          SPACE,
          PLUS,
          SPACE,
          camelCase(part.slice(1)),
          SPACE,
          PLUS,
          SPACE,
          SINGLE_QUOTE,
        ].join('');
      }

      return PATH_DELIMETER + part;
    });

  finalPathStr += parts.join('') + SINGLE_QUOTE;

  return finalPathStr;
}

function requestCanHaveBody(method) {
  const m = method.toUpperCase();
  return m === 'POST' || m === 'PUT' || m === 'PATCH';
}

function getQueryParameters(operation) {
  return operation.parameters.filter((param) => param.location === 'Query');
}

function getQueryParameterNames(operation) {
  return getQueryParameters(operation).map((param) => ({
    name: param.name,
    nameCamelCase: camelCase(param.name),
  }));
}

function getPathParameters(operation) {
  return operation.parameters.filter((param) => param.location === 'Path');
}

function getFunctionParametersJs(operation) {
  const params = getPathParameters(operation).map((p) => camelCase(p.name));
  const queryPrams = getQueryParameters(operation);

  if (queryPrams.length || requestCanHaveBody(operation.method)) {
    params.push('options');
  }

  return params.join(', ');
}

function requiresOptions(operation) {
  const queryPrams = getQueryParameters(operation);
  return queryPrams.length || requestCanHaveBody(operation.method);
}

function pathToCapitalCase(operation) {
  let parts;
  let pathParamTokens;
  let otherPathTokens;
  let finalTokens = [];

  if (operation.path) {
    parts = operation.path.slice(1).split('/');
    parts = parts.slice(1); // drop the resource name prefix

    pathParamTokens = parts.filter((part) => part.indexOf(':') === 0);
    otherPathTokens = parts.filter((part) => part.indexOf(':') === -1);

    otherPathTokens = otherPathTokens.map((token) => capitalizeFirstLetter(camelCase(token)));
    pathParamTokens = pathParamTokens.map((token, index) => {
      const prefix = (index === 0) ? 'By' : 'And';
      return prefix + capitalizeFirstLetter(camelCase(token.slice(1)));
    });

    finalTokens = finalTokens.concat(otherPathTokens);
    finalTokens = finalTokens.concat(pathParamTokens);

    return finalTokens.join('');
  }

  return '';
}

function getFunctionName(operation) {
  let name = operation.method.toLowerCase();

  name += pathToCapitalCase(operation);

  return alphaNumOnly(name);
}

function getParameterData(operation) {
  const pathParams = getPathParameters(operation);
  const queryPrams = getQueryParameters(operation);
  const paramData = pathParams.map((param) => ({
    name: camelCase(param.name),
    type: '{string}',
  }));
  const objectProperties = [];

  if (requestCanHaveBody(operation.method)) {
    objectProperties.push({
      name: 'data',
      type: '{Object}',
      description: 'The request body',
    });
  }

  queryPrams.forEach((param) => {
    objectProperties.push({
      name: camelCase(param.name),
      type: `{${getJSDocType(param.type)}}`,
    });
  });

  if (objectProperties.length) {
    paramData.push({
      name: 'options',
      type: '{Object}',
      properties: objectProperties,
    });
  }

  return paramData;
}

function createOperation(pathRoot, operation) {
  return {
    description: operation.description,
    method: operation.method,
    path: operation.path,
    uriJs: getPathStringBuilder(pathRoot, operation),
    functionName: getFunctionName(operation),
    functionParameters: getParameterData(operation),
    functionParametersJs: getFunctionParametersJs(operation),
    queryStringParameters: getQueryParameterNames(operation),
    responses: getDeclaredResponses(operation),
    requestCanHaveBody: requestCanHaveBody(operation.method),
    requiresOptions: requiresOptions(operation),
    requiresBody: !!operation.body,
  };
}

function createResource(properties) {
  const { operations } = properties;
  const resource = {
    name: properties.type,
    objectName: getResourceObjectName(properties.plural),
    methods: operations.map((op) => createOperation(properties.plural, op)),
  };

  return resource;
}

module.exports = {
  createResource,
  getQueryParameters,
  getQueryParameterNames,
  getDeclaredResponses,
  getResourceObjectName,
};
