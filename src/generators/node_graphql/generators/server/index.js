const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const { ApiBuilderFile } = require('../../../../utilities/apibuilder');

function generateReadme(service) {
  const templatePath = path.resolve(__dirname, './templates/readme.ejs');
  const templateData = { service };
  return renderTemplate(templatePath, templateData, { prettier: false });
}

function generateReadmeFile(service) {
  const destinationPath = 'lib/server/README.md';
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const content = generateReadme(service);
  return new ApiBuilderFile(basename, dirname, content);
}

function generateApplicationCode() {
  const templatePath = path.resolve(__dirname, './templates/application.ejs');
  return renderTemplate(templatePath);
}

function generateApplicationFile() {
  const destinationPath = 'lib/server/index.js';
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const content = generateApplicationCode();
  return new ApiBuilderFile(basename, dirname, content);
}

function generateFiles(service) {
  const files = [];
  files.push(generateReadmeFile(service));
  files.push(generateApplicationFile());
  return files;
}

exports.generateFiles = generateFiles;
