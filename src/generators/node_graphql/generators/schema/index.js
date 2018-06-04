const path = require('path');

const { ApiBuilderFile } = require('../../../../utilities/apibuilder');
const { renderTemplate } = require('../../../../utilities/template');
const { generateFile: generateEnumFile } = require('../enumeration');
const { generateFile: generateModelFile } = require('../model');
const { generateFile: generateUnionFile } = require('../union');

function generateReadme(service) {
  const templatePath = path.resolve(__dirname, './templates/readme.ejs');
  const templateData = { service };
  return renderTemplate(templatePath, templateData, { prettier: false });
}

function generateReadmeFile(service) {
  const destinationPath = 'README.md';
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const content = generateReadme(service);
  return new ApiBuilderFile(basename, dirname, content);
}

/**
 * @param {ApiBuilderService} service
 * @returns {ApiBuilderFile[]}
 */
function generateFiles(service) {
  const files = [];

  files.push(generateReadmeFile(service));

  service.internalEnums.forEach((enumeration) => {
    files.push(generateEnumFile(enumeration));
  });

  service.internalModels.forEach((model) => {
    files.push(generateModelFile(model));
  });

  service.internalUnions.forEach((union) => {
    files.push(generateUnionFile(union));
  });

  return files;
}

exports.generateFiles = generateFiles;
