import { ReferenceObject } from '@loopback/openapi-v3-types';
import {
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderUnion,
} from 'apibuilder-js';

function convertApiBuilderTypeToReference(
  type: ApiBuilderModel | ApiBuilderEnum | ApiBuilderUnion,
): ReferenceObject {
  return {
    $ref: `#/components/schemas/${type.shortName}`,
  };
}

export default convertApiBuilderTypeToReference;
