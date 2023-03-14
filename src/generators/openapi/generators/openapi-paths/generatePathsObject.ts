import { PathsObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import mapValues from 'lodash/mapValues';
import { generateOperationObject } from '../openapi-operation';
import {
  extractApiBuilderResourceOperations,
  typeValidator,
} from '../openapi-utils';

function generatePathsObject(service: ApiBuilderService): PathsObject {
  const validator = typeValidator(service);
  const resourceOperations = extractApiBuilderResourceOperations(service.resources);
  return mapValues(
    resourceOperations,
    (resourceOperation) => resourceOperation.reduce<PathsObject>(
      (resourcePaths, operation) => {
        // eslint-disable-next-line no-param-reassign
        resourcePaths[operation.method.toLowerCase()] = generateOperationObject(
          operation,
          service,
          validator,
        );
        return resourcePaths;
      },
      {},
    ),
  );
}

export default generatePathsObject;
