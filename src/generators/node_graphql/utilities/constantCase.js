const flow = require('lodash/flow');
const snakeCase = require('lodash/snakeCase');
const toUpper = require('lodash/toUpper');

const constantCase = flow(snakeCase, toUpper);

module.exports = constantCase;
