import {
  ApiBuilderBaseType,
  ApiBuilderOperationArgument,
  ApiBuilderService,
  ApiBuilderType,
  isEnumType,
  isPrimitiveType,
} from '../../../utilities/apibuilder';
import toGraphQLOutputType = require('./toGraphQLOutputType');

/**
 * Returns whether the type matches str, str_v2, str_v*...
 */
function typeMatches(type: ApiBuilderBaseType, str: string) {
  return type.fullyQualifiedType.fullyQualifiedType.match(new RegExp(`^${str}(?:_v\\d+)?$`));
}

class GraphQLQueryArgConfig {
  name: string;
  fullyQualifiedType: ApiBuilderType;
  required: boolean;
  default: string;
  description: string;
  service: ApiBuilderService;

  constructor(arg: ApiBuilderOperationArgument, service: ApiBuilderService) {
    this.name = arg.name;
    this.fullyQualifiedType = arg.type;
    this.required = arg.required;
    this.default = arg.defaultValue;
    this.description = arg.description;
    this.service = service;
  }

  get type() {
    return toGraphQLOutputType(this.fullyQualifiedType, this.required, this.service);
  }

  get defaultValue() {
    if (this.default) {
      if (isPrimitiveType(this.fullyQualifiedType) && this.fullyQualifiedType.typeName === 'string') {
        return `'${this.default}'`; // strings
      }

      if (isEnumType(this.fullyQualifiedType)) {
        return `'${this.default}'`; // enums
      }

      return this.default;
    }
    return undefined;
  }
}
