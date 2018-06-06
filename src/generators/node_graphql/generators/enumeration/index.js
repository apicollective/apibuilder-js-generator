const path = require('path');

const { ApiBuilderFile } = require('../../../../utilities/apibuilder');
const { renderTemplate } = require('../../../../utilities/template');
const destinationPathFromType = require('../../utilities/destinationPathFromType');
const toDefaultExport = require('../../utilities/toDefaultExport');
const GraphQLEnumType = require('../../utilities/GraphQLEnumType');

function generateCode(enumeration) {
  const templatePath = path.resolve(__dirname, './templates/GraphQLEnumType.ejs');
  return renderTemplate(templatePath, {
    exportName: toDefaultExport(enumeration),
    enumeration: GraphQLEnumType.fromApiBuilderEnum(enumeration),
  });
}

exports.generateCode = generateCode;

/**
 * Creates API Builder file containing generated GraphQL enum type from provided
 * API Builder enumeration.
 * @param {ApiBuilderEnum} enumeration
 * @returns {ApiBuilderFile}
 */
function generateFile(enumeration) {
  const destinationPath = destinationPathFromType(enumeration);
  const basename = path.basename(destinationPath);
  const dirname = path.dirname(destinationPath);
  const contents = generateCode(enumeration);
  return new ApiBuilderFile(basename, dirname, contents);
}

exports.generateFile = generateFile;
