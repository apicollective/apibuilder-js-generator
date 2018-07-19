import invariant = require('invariant');
import { ApiBuilderType, isType } from '..';

/**
 * An array is an enclosing type which points to another type.
 * Arrays are often created within the context of defining the fields of
 * a model type.
 */
export class ApiBuilderArray {
  public ofType: ApiBuilderType;

  constructor(ofType) {
    invariant(isType(ofType), `${String(ofType)} is not an API Builder type.`);
    this.ofType = ofType;
  }

  public toString() {
    return `[${String(this.ofType)}]`;
  }
}
