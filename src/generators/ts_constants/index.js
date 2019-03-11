const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');
const { reduce, sortBy, uniqBy } = require('lodash');
const { resolve } = require('path');
const { renderTemplate } = require('../../utilities/template');

exports.generate = function generate(invocationForm) {
  const service = new ApiBuilderService(invocationForm.service);
  const templatePath = resolve(__dirname, './templates/enumerations.ejs');
  const dirname = service.namespace.split('.').join('/');
  const basename = 'enums.ts';
  const contents = renderTemplate(templatePath, {
    enumerations: sortBy(service.enums, 'nickname'),
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
