import invariant = require('invariant');
import { ApiBuilderType, isType } from '.';
/**
 * A map is an enclosing type which points to another type.
 * Maps are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderMap {
  ofType: ApiBuilderType;

  constructor(ofType) {
    invariant(isType(ofType), `${String(ofType)} is not an API Builder type.`);
    this.ofType = ofType;
  }

  toString() {
    return `map[${String(this.ofType)}]`;
  }
}
