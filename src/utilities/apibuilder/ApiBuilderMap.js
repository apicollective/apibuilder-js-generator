// TODO: There is a circular cycle that prevents us from validating provided type.
// const invariant = require('invariant');
// const isType = require('./isType');

class ApiBuilderMap {
  constructor(ofType) {
    // invariant(isType(ofType), `${String(ofType)} is not an API Builder type.`);
    this.ofType = ofType;
  }

  toString() {
    return `map[${String(this.ofType)}]`;
  }
}

module.exports = ApiBuilderMap;
