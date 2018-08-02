import invariant = require('invariant');
import { FullyQualifiedType } from '..';

export class ApiBuilderPrimitiveType {
  public fullyQualifiedType: FullyQualifiedType;

  /**
   * Create an ApiBuilderPrimitiveType
   * @param {FullyQualifiedType} fullyQualifiedType
   */
  constructor(fullyQualifiedType) {
    invariant(
      fullyQualifiedType.isPrimitiveType,
      `${String(fullyQualifiedType)} is not an API builder primitive type.`,
    );

    this.fullyQualifiedType = fullyQualifiedType;
  }

  get baseType() {
    return this.fullyQualifiedType.baseType;
  }

  get shortName() {
    return this.fullyQualifiedType.shortName;
  }

  get packageName() {
    return this.fullyQualifiedType.packageName;
  }

  get typeName() {
    return this.fullyQualifiedType.fullyQualifiedType;
  }

  public toString() {
    return this.baseType;
  }
}
