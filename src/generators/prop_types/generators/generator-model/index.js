const ejs = require('ejs');
const fs = require('fs');
const matches = require('lodash/matches');
const path = require('path');
const toImportStatement = require('../../utilities/toImportStatement');
const toPropTypes = require('../../utilities/toPropTypes');

const templatePath = path.resolve(__dirname, './templates/model.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

function mapToImportStatements(model) {
  // Primitive types do not require import.
  return model.fields
    .filter(field => !field.isPrimitive)
    .reduce((importStatements, field) => {
      const importStatement = toImportStatement(model, field);
      const isAlreadyImported = importStatements.some(matches(importStatement));
      // TODO: Check for possible default export name collision.
      return isAlreadyImported ? importStatements : importStatements.concat(importStatement);
    }, []);
}

function mapToPropTypes(model) {
  return model.fields.map(field => ({
    key: field.schema.name,
    validator: toPropTypes(field, field.schema.required),
  }));
}

function generate(model) {
  const importStatements = mapToImportStatements(model);
  const propTypes = mapToPropTypes(model);
  return compiled({ importStatements, propTypes });
}

module.exports = generate;
