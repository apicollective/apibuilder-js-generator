const { ApiBuilderFile, ApiBuilderService, Kind, isPrimitiveType, isArrayType, isMapType } = require('apibuilder-js');
const { reduce, sortBy, uniqBy } = require('lodash');
const { resolve } = require('path');
const upperFirst = require('lodash/upperFirst');
const camelCase = require('lodash/camelCase');
const { renderTemplate } = require('../../utilities/template');

function camelCapitalize(value) {
  return upperFirst(camelCase(value));
}

function primitiveToTypeScriptTypeName(type) {
  switch (type.shortName) {
  case Kind.STRING:
  case Kind.DATE_ISO8601:
  case Kind.DATE_TIME_ISO8601:
  case Kind.UUID:
    return 'string';
  case Kind.BOOLEAN:
    return 'boolean';
  case Kind.DECIMAL:
  case Kind.DOUBLE:
  case Kind.INTEGER:
  case Kind.LONG:
    return 'number';
  case Kind.ARRAY:
    return 'Array';
  case Kind.OBJECT:
    return 'object';
  default:
    return 'any';
  }
}

function toJavaScriptTypeName(type) {
  if (isPrimitiveType(type)) {
    return primitiveToTypeScriptTypeName(type);
  }

  if (isArrayType(type)) {
    return `Array<${toJavaScriptTypeName(type.ofType)}>`;
  }

  if (isMapType(type)) {
    return 'Object';
  }

  return camelCapitalize(type.shortName);
}

exports.generate = function generate(invocationForm) {
  const service = new ApiBuilderService(invocationForm.service);
  const templatePath = resolve(__dirname, './templates/declarations.ejs');
  const dirname = service.namespace.split('.').join('/');
  const basename = 'index.d.ts';
  const contents = renderTemplate(templatePath, {
    service,
    camelCapitalize,
    toJavaScriptTypeName,
  }, {
    prettier: {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'es5',
    },
  });
  const file = new ApiBuilderFile(basename, dirname, contents);
  return Promise.resolve([file]);
};
