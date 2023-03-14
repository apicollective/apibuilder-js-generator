import { ApiBuilderService, ApiBuilderType } from 'apibuilder-js';

function typeValidator(service: ApiBuilderService) {
  return function validator(builderType: ApiBuilderType) {
    const type = 'baseTypeName' in builderType ? service.findTypeByName(builderType.baseTypeName) : undefined;
    return Boolean(type);
  };
}

export default typeValidator;
