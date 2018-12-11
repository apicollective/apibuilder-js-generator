const { ApiBuilderFile, ApiBuilderService } = require('apibuilder-js');
const path = require('path');
const { renderTemplate } = require('../../utilities/template');

function shortNameCompare(a, b) {
  if (a.shortName > b.shortName) return 1;
  if (a.shortName < b.shortName) return -1;
  return 0;
}

function generateEnumFiles(service) {
  const templatePath = path.resolve(__dirname, './templates/enumeration.ejs');
  return service.enums.reduce((files, enumeration) => {
    const basename = `${enumeration.nickname}.ts`;
    const dirname = '.';
    const contents = renderTemplate(templatePath, { enumeration }, { prettier: false });
    const file = new ApiBuilderFile(basename, dirname, contents);
    return files.concat(file);
  }, []);
}

function generateIndexFile(service) {
  const templatePath = path.resolve(__dirname, './templates/index.ejs');
  const basename = 'index.ts';
  const dirname = '.';
  const contents = renderTemplate(templatePath, {
    enumerations: service.enums.sort(shortNameCompare),
  }, { prettier: false });
  const file = new ApiBuilderFile(basename, dirname, contents);
  return file;
}

exports.generate = function generate(invocationForm) {
  const service = new ApiBuilderService(invocationForm.service);
  const files = generateEnumFiles(service).concat(generateIndexFile(service));
  return Promise.resolve(files);
}
