const camelCase = require('lodash/camelCase');
const flow = require('lodash/flow');
const upperFirst = require('lodash/upperFirst');

const pascalCase = flow(camelCase, upperFirst);

module.exports = pascalCase;
