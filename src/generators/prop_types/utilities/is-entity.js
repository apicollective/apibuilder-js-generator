const overSome = require('lodash/overSome');
const some = require('lodash/some');
const matches = require('lodash/matches');
const getRootType = require('../../../utilities/apibuilder/utilities/get-root-type');

function isEntity(value, entities) {
  return some(entities, overSome([
    matches({ id: getRootType(value) }),
    matches({ name: getRootType(value) }),
  ]));
}

module.exports = isEntity;
