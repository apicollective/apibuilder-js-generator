// TODO: There is a circular cycle here that prevent us from checking for a valid type.
// const invariant = require('invariant');
// const isType = require('./isType');

class ApiBuilderArray {
  constructor(ofType) {
    // invariant(isType(ofType), `${String(ofType)} is not an API Builder type.`);

    Object.defineProperties(this, {
      ofType: {
        enumerable: true,
        value: ofType,
      },
    });
  }

  toString() {
    return `[${String(this.ofType)}]`;
  }
}

module.exports = ApiBuilderArray;
