const { ApiBuilderFile, ApiBuilderService, Kind, isPrimitiveType, isArrayType, isMapType } = require('apibuilder-js');
const { resolve } = require('path');
const camelCase = require('lodash/camelCase');
const flow = require('lodash/flow');
const upperFirst = require('lodash/upperFirst');

const { renderTemplate } = require('../../utilities/template');

const pascalCase = flow(camelCase, upperFirst);

function primitiveToJavaScriptTypeName(type) {
  switch (type.shortName) {
  case Kind.STRING:
  case Kind.DATE_ISO8601:
  case Kind.DATE_TIME_ISO8601:
  case Kind.UUID:
    return 'String';
  case Kind.BOOLEAN:
    return 'Boolean';
  case Kind.DECIMAL:
  case Kind.DOUBLE:
  case Kind.INTEGER:
  case Kind.LONG:
    return 'Number';
  case Kind.ARRAY:
    return 'Array';
  case Kind.OBJECT:
    return 'Object';
  default:
    return 'Any';
  }
}

function toJavaScriptTypeName(type) {
  if (isPrimitiveType(type)) {
    return primitiveToJavaScriptTypeName(type);
  }

  if (isArrayType(type)) {
    return `${toJavaScriptTypeName(type.ofType)}[]`;
  }

  if (isMapType(type)) {
    return `Object.<String, ${toJavaScriptTypeName(type.ofType)}>`;
  }

  return pascalCase(type.shortName);
}

exports.generate = function generate(invocationForm) {
  const service = new ApiBuilderService(invocationForm.service);
  const templatePath = resolve(__dirname, './templates/comments.ejs');
  const dirname = '.';
  const basename = 'index.js';
  const contents = renderTemplate(templatePath, {
    service,
    toJavaScriptTypeName,
  }, {
    prettier: {
      singleQuote: true,
      trailingComma: 'es5',
    },
  });
  const file = new ApiBuilderFile(basename, dirname, contents);
  return Promise.resolve([file]);
}
