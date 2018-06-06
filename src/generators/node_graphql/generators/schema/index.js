const path = require('path');

const { ApiBuilderFile } = require('../../../../utilities/apibuilder');
const { renderTemplate } = require('../../../../utilities/template');
const { generateFile: generateEnumFile } = require('../enumeration');
const { generateFile: generateModelFile } = require('../model');
const { generateFile: generateUnionFile } = require('../union');

/**
 * @param {ApiBuilderService} service
 * @returns {ApiBuilderFile[]}
 */
function generateFiles(service) {
  const files = [];

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
