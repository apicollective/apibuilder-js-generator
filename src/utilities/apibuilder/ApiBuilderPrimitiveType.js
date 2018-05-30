const invariant = require('invariant');

class ApiBuilderPrimitiveType {
  /**
   * Create an ApiBuilderPrimitiveType
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
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

  toString() {
    return this.baseType;
  }
}

module.exports = ApiBuilderPrimitiveType;
