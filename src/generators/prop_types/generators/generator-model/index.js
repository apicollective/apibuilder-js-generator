const ejs = require('ejs');
const filter = require('lodash/filter');
const fs = require('fs');
const map = require('lodash/map');
const path = require('path');
const isEntity = require('../../utilities/is-entity');
const toImportStatement = require('../../utilities/to-import-statement');
const toPropTypesValidator = require('../../utilities/to-prop-types-validator');

const templatePath = path.resolve(__dirname, './templates/model.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

function toPropTypes(field, entities) {
  const key = field.name;
  const validator = toPropTypesValidator(field.type, entities, field.required);
  return { key, validator };
}

function mapFieldsToImportStatements(fields, entities) {
  const entityFields = filter(fields, field => isEntity(field.type, entities));
  return map(entityFields, field => toImportStatement(field.type, entities));
}

function mapFieldsToPropTypes(fields, entities) {
  return map(fields, field => toPropTypes(field, entities));
}

function generate(model, service) {
  const { name, entity } = model;
  const { fields } = entity;
  const entities = service.getIndexedEntity(name, service.getIndexed());
  const imports = mapFieldsToImportStatements(fields, entities);
  const propTypes = mapFieldsToPropTypes(fields, entities);
  return compiled({ imports, propTypes });
}

module.exports = generate;
