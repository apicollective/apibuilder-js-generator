import invariant = require('invariant');
import { map, matches } from 'lodash';
import { ApiBuilderBaseType, ApiBuilderField, FullyQualifiedType, isEnclosingType } from '..';
import { ApiBuilderService } from './service';

/**
 * Returns whether the type matches str, str_v2, str_v*...
 */
function typeMatches(type: ApiBuilderBaseType, str: string) {
  return type.fullyQualifiedType.fullyQualifiedType.match(new RegExp(`^${str}(?:_v\\d+)?$`));
}

export class ApiBuilderModel {
  /**
   * Returns the ApiBuilderModel corresponding to the specified API builder model definition.
   * @param {Object} config An object representing an API Builder model definition.
   */
  public static fromSchema(
    config,
    service: ApiBuilderService,
    namespace: string = service.namespace,
  ) {
    const fullyQualifiedType = new FullyQualifiedType(`${namespace}.models.${config.name}`);
    return new ApiBuilderModel(config, fullyQualifiedType, service);
  }

  public fullyQualifiedType: FullyQualifiedType;
  public service: any;
  private config: any;

  /**
   * Create an ApiBuilderModel.
   * @param {Object} config - An object representing an API builder model definition.
   * @param {FullyQualifiedType} fullyQualifiedType
   * @param {ApiBuilderService} service
   */
  constructor(config, fullyQualifiedType, service) {
    invariant(
      !fullyQualifiedType.isEnclosingType,
      `${String(fullyQualifiedType)} is a collection type. ` +
      'You cannot create an model from a collection type.',
    );

    invariant(
      !fullyQualifiedType.isPrimitiveType,
      `${String(fullyQualifiedType)} is a primitive type. ` +
      'You cannot create an model from a primitive type.',
    );

    this.config = config;
    this.fullyQualifiedType = fullyQualifiedType;
    this.service = service;
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

  /** @property {?String} */
  get description() {
    return this.config.description;
  }

  /** @property {!ApiBuilderField[]} */
  get fields() {
    return map(this.config.fields, field =>
      ApiBuilderField.fromSchema(field, this.service));
  }

  /** @property {!ApiBuilderOperation} */
  get getter() {
    const resource = this.service.resources.find(res => res.type === this);

    if (!resource) {
      return undefined;
    }

    const getter = resource.operations
      .filter(matches({ method: 'GET' }))
      .filter(op => !isEnclosingType(op.resultType))
      .filter(op => typeMatches(op.resultType, resource.type.toString()))
      .sort((a, b) => a.path.length - b.path.length)[0];

    return getter;
  }

  public toString() {
    return this.baseType;
  }
}
