const { toCamelCase, slug } = require('./strings');
const { getFunctionName, getFunctionParamsStr } = require('./service');

function getOperation(operation, path) {
  const parametersPath = operation.parameters.filter((p) => p.location === 'Path');
  const parametersQuery = operation.parameters.filter((p) => p.location === 'Query');

  const op = {
    name: getFunctionName(operation, path),
    parameterString: getFunctionParamsStr(operation),
    parameters: operation.parameters,
    parametersPath,
    parametersQuery,
    hasParametersPath: parametersPath.length > 0,
    hasParametersQuery: parametersQuery.length > 0,
  };

  if (operation.body) {
    op.body = operation.body;
  }

  return op;
}

function serviceToJson(service) {
  const resources = service.resources.map((resource) => ({
    name: toCamelCase(slug(resource.plural)),
    operations: resource.operations.map((operation) => getOperation(operation, resource.path)),
    description: resource.description,
  }));

  return {
    name: service.name,
    version: service.version,
    resources,
  };
}

module.exports = serviceToJson;
