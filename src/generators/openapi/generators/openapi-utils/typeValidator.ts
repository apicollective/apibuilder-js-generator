import { ApiBuilderService } from 'apibuilder-js';

function typeValidator(service: ApiBuilderService) {
  return function validator(builderType) {
    const type = service.findTypeByName(builderType.baseTypeName);
    return Boolean(type);
  };
}

export default typeValidator;
