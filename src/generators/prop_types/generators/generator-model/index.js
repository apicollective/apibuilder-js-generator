const matches = require('lodash/matches');
const path = require('path');

const { renderTemplate } = require('../../../../utilities/template');
const { getBaseType, isPrimitiveType } = require('../../../../utilities/apibuilder');
const toImportStatement = require('../../utilities/toImportStatement');
const toPropTypes = require('../../utilities/toPropTypes');
const isCyclic = require('../../utilities/isCyclic');

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
    isCyclic: isCyclic(model, field.type),
  }));
}

function generate(model) {
  const templatePath = path.resolve(__dirname, './templates/model.ejs');
  const importStatements = mapToImportStatements(model);
  const propTypes = mapToPropTypes(model);
  return renderTemplate(templatePath, { importStatements, propTypes });
}

module.exports = generate;
