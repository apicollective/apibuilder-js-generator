const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const { getBaseType, isPrimitiveType } = require('../../../../utilities/apibuilder');
const toImportStatement = require('../../utilities/toImportStatement');
const toPropTypes = require('../../utilities/toPropTypes');

function mapToPropTypes(union) {
  return union.types.map(({ type }) => toPropTypes(type));
}

function mapToImportStatements(union) {
  return union.types
    .map(field => getBaseType(field.type))
    // Primitive types do not require import.
    .filter(baseType => !isPrimitiveType(baseType))
    // TODO: Check for possible default export name collision.
    .map(baseType => toImportStatement(union, baseType));
}

function generate(union) {
  const templatePath = path.resolve(__dirname, './templates/union.ejs');
  const importStatements = mapToImportStatements(union);
  const validators = mapToPropTypes(union);
  // TODO: Need to include discriminator.
  return renderTemplate(templatePath, { importStatements, validators });
}

module.exports = generate;
