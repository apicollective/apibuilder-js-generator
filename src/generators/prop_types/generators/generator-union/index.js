const ejs = require('ejs');
const fs = require('fs');
const filter = require('lodash/filter');
const map = require('lodash/map');
const path = require('path');
const isEntity = require('../../utilities/is-entity');
const toImportStatement = require('../../utilities/to-import-statement');
const toPropTypesValidator = require('../../utilities/to-prop-types-validator');

const templatePath = path.resolve(__dirname, './templates/union.ejs');
const template = fs.readFileSync(templatePath, 'utf8');
const compiled = ejs.compile(template);

function mapTypesToValidators(types, entities) {
  return map(types, type => toPropTypesValidator(type.type, entities));
}

function mapTypesToImportStatements(types, entities) {
  const entityTypes = filter(types, type => isEntity(type.type, entities));
  return map(entityTypes, type => toImportStatement(type.type, entities));
}

function generate(union, service) {
  const { name, entity } = union;
  const { types } = entity;
  const entities = service.getIndexedEntity(name, service.getIndexed());
  const importStatements = mapTypesToImportStatements(types, entities);
  const validators = mapTypesToValidators(types, entities);
  // TODO: Need to include discriminator.
  // Copying same approach as before for now.
  return compiled({ importStatements, validators });
}

module.exports = generate;
