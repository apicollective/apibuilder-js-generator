const ejs = require('ejs');
const fs = require('fs');
const matches = require('lodash/matches');
const path = require('path');

const getBaseType = require('../../../../utilities/apibuilder/getBaseType');
const isPrimitiveType = require('../../../../utilities/apibuilder/isPrimitiveType');
const toImportStatement = require('../../utilities/toImportStatement');
const toPropTypes = require('../../utilities/toPropTypes');

const templatePath = path.resolve(__dirname, './templates/model.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

function mapToImportStatements(model) {
  return model.fields
    .map(field => getBaseType(field.type))
    // Primitive types do not require import.
    .filter(baseType => !isPrimitiveType(baseType))
    .reduce((importStatements, baseType) => {
      const importStatement = toImportStatement(model, baseType);
      const isAlreadyImported = importStatements.some(matches(importStatement));
      // TODO: Check for possible default export name collision.
      return isAlreadyImported ? importStatements : importStatements.concat(importStatement);
    }, []);
}

function mapToPropTypes(model) {
  return model.fields.map(field => ({
    key: field.name,
    validator: toPropTypes(field.type, field.isRequired),
  }));
}

function generate(model) {
  const importStatements = mapToImportStatements(model);
  const propTypes = mapToPropTypes(model);
  return compiled({ importStatements, propTypes });
}

module.exports = generate;
