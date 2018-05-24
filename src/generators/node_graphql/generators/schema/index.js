const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const get = require('lodash/get');
const { upperFirst, camelCase, capitalize, flatMap } = require('lodash');
const pluralize = require('pluralize');

const templatePath = path.resolve(__dirname, './templates/schema.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

const log = require('debug')('apibuilder:graphql');

function getResultType(operation) {
  return get(operation.responses.filter(r => r.code.integer.value >= 200 && r.code.integer.value < 300), '[0].type');
}

function getFunctionName(resource, operation) {
  if (operation.path) {
    // log('getFunctionName(', operation.path, ')')
    let pathWithOutPrefix = operation.path.replace(resource.path, '');

    if (pathWithOutPrefix.startsWith('/')) {
      pathWithOutPrefix = pathWithOutPrefix.slice(1);
    }

    const parts = pathWithOutPrefix.split('/');
    const variableParts = parts
      .filter(p => p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? 'By' : 'And';
        return prefix + upperFirst(camelCase(part.slice(1)));
      });

    // log('\tvariable parts', variableParts);

    const staticParts = parts
      .filter(p => !p.startsWith(':'))
      .map((part, idx) => {
        const prefix = (idx === 0) ? '' : 'And';
        return prefix + upperFirst(camelCase(part));
      });

    // log('\tstatic parts', staticParts);

    const sortedParts = staticParts.concat(variableParts);

    // log(getResultType(operation));
    if (getResultType(operation).isEnclosingType) {
      return camelCase(pluralize(getResultType(operation).shortName)) + sortedParts.join('');
    }

    return camelCase(resource.type.shortName) + sortedParts.join('');
  }

  return camelCase(resource.type.shortName);
}

/**
 * Generates source file content for API Builder enum types.
 * @param {Service} service
 */
function generate(service) {
  return compiled({
    queries: flatMap(service.resources, resource =>
      resource.operations.filter(op => op.method === 'GET').map(op => ({
        name: getFunctionName(resource, op),
        type: getResultType(op).fullyQualifiedType,
        description: op.description,
        deprecation: op.deprecation,
      }))
    ),
  });
}

module.exports = generate;
