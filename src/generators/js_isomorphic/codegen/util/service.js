const { toCamelCase, capitalizeFirstLetter, slug } = require('./strings');

function getPathParameters(operation) {
  return operation.parameters.filter((param) => param.location === 'Path');
}

function getFunctionParamsStr(operation) {
  const params = getPathParameters(operation).map((p) => toCamelCase(p.name));
  return params.concat(['options = {}']).join(', ');
}

function getJsArrayStr(values) {
  return `[${values.map((v) => `'${v.name}'`).join(', ')}],`;
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
      .filter((p) => p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? 'By' : 'And';
        return prefix + capitalizeFirstLetter(toCamelCase(slug(part.slice(1))));
      });
    const staticParts = parts
      .filter((p) => !p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? '' : 'And';
        return prefix + capitalizeFirstLetter(toCamelCase(slug(part)));
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
      // match path parameter with possible file suffix delimitee by period.
      const pathParamMatch = part.match(/^:([\w-]+)(\.[\w.]*)?/);
      if (pathParamMatch !== null) {
        const subParts = [`/${START_LITERAL}${toCamelCase(pathParamMatch[1])}${END_LITERAL}`];
        if (pathParamMatch.length > 2) { // match has possible suffix (i.e. .json, .csv etc..)
          subParts.push(pathParamMatch[2]);
        }
        return subParts.join('');
      }
      return `/${part}`;
    });

  return `${parts.join('')}`;
}

module.exports = {
  getFunctionName, getFunctionParamsStr, getEndpointUriStr, getJsArrayStr,
};
