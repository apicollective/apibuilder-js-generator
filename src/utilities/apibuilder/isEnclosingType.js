const overSome = require('lodash/overSome');

const isArrayType = require('./isArrayType');
const isMapType = require('./isMapType');

const isEnclosingType = overSome([
  isArrayType,
  isMapType,
]);

module.exports = isEnclosingType;
