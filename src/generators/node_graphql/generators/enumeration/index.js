const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const prettier = require('prettier');

const toDefaultExport = require('../../utilities/toDefaultExport');
const GraphQLEnumTypeConfig = require('../../utilities/GraphQLEnumTypeConfig');

const templatePath = path.resolve(__dirname, './templates/enumeration.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

/**
 * @param {ApiBuilderEnum} enumeration
 */
function generateCode(enumeration) {
  const source = compiled({
    exportName: toDefaultExport(enumeration),
    enumeration: GraphQLEnumTypeConfig.fromEnum(enumeration),
  });
  return prettier.format(source, {
    singleQuote: true,
    trailingComma: 'es5',
  });
}

module.exports = generateCode;
