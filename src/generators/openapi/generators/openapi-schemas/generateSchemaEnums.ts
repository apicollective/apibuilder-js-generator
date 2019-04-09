import { ApiBuilderService } from 'apibuilder-js';
import { map } from 'lodash';
import { generateSchemaFromEnum } from '../openapi-schemas';

function generateSchemaEnums(service: ApiBuilderService) {
  return map(service.enums, enm => generateSchemaFromEnum(enm));
}

export default generateSchemaEnums;
