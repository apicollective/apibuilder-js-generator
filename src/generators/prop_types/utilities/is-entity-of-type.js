const overSome = require('lodash/overSome');
const some = require('lodash/some');
const matches = require('lodash/matches');
const getRootType = require('../../../utilities/apibuilder/utilities/get-root-type');

function isEntityOfType(value, type, entities) {
  return some(entities, overSome([
    matches({ type, id: getRootType(value) }),
    matches({ type, name: getRootType(value) }),
  ]));
}

module.exports = isEntityOfType;
