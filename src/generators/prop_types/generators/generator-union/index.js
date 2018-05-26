const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const toImportStatement = require('../../utilities/toImportStatement');
const toPropTypes = require('../../utilities/toPropTypes');

const templatePath = path.resolve(__dirname, './templates/union.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

function mapToPropTypes(union) {
  return union.types.map(({ type }) => toPropTypes(type));
}

function mapToImportStatements(union) {
  return union.types
    // Primitive types do not require import.
    .filter(({ type }) => !type.isPrimitive)
    // TODO: Check for possible default export name collision.
    .map(({ type }) => toImportStatement(union, type));
}

function generate(union) {
  const importStatements = mapToImportStatements(union);
  const validators = mapToPropTypes(union);
  // TODO: Need to include discriminator.
  return compiled({ importStatements, validators });
}

module.exports = generate;
