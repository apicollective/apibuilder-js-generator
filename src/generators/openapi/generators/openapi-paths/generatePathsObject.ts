import { PathsObject } from '@loopback/openapi-v3-types';
import { ApiBuilderService } from 'apibuilder-js';
import {
  mapValues,
  reduce,
} from 'lodash';
import { generateOperationObject } from '../openapi-operation';
import {
  extractApiBuilderResourceOperations,
  typeValidator,
} from '../openapi-utils';

function generatePathsObject(service: ApiBuilderService): PathsObject {
  const validator = typeValidator(service);
  const resourceOperations = extractApiBuilderResourceOperations(service.resources);
  const paths = mapValues(resourceOperations, (resourceOperation) => {
    return reduce(
      resourceOperation,
      (resourcePaths, operation) => {
        resourcePaths[operation.method.toLowerCase()] = generateOperationObject(
          operation,
          validator,
        );
        return resourcePaths;
      },
      {},
    );
  });
  return paths;
}

export default generatePathsObject;
