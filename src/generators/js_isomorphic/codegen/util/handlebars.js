const fs = require('fs');
const handlebars = require('handlebars');
const {
  getJsArrayStr,
  getFunctionName,
  getFunctionParamsStr,
  getEndpointUriStr,
} = require('./service');

const { toCamelCase, capitalizeFirstLetter, slug } = require('./strings');

handlebars.registerHelper('objectName', str =>
  capitalizeFirstLetter(toCamelCase(slug(str))));

handlebars.registerHelper('className', str =>
  capitalizeFirstLetter(toCamelCase(slug(str))));

handlebars.registerHelper('slug', str =>
  slug(str));

handlebars.registerHelper('toCamelCase', str => toCamelCase(str));

handlebars.registerHelper('jsArrayStr', values =>
  getJsArrayStr(values));

handlebars.registerHelper('operationName', (operation, resourcePath) =>
  getFunctionName(operation, resourcePath));

handlebars.registerHelper('parameterList', operation =>
  getFunctionParamsStr(operation));

handlebars.registerHelper('operationPath', operation =>
  getEndpointUriStr(operation));

// eslint-disable-next-line func-names
handlebars.registerHelper('nonGetMethod', function(operation, options) {
  return operation.method !== 'GET' ? options.fn(this) : options.inverse(this);
});

function loadTemplate(path) {
  const fileContents = fs.readFileSync(path).toString('utf-8');
  const hbs = handlebars.compile(fileContents);
  return hbs;
}

module.exports = { loadTemplate };
