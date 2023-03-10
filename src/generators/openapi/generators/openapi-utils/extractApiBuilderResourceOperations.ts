import { ApiBuilderOperation, ApiBuilderResource } from 'apibuilder-js';
import {
  flatten,
  groupBy,
  map,
} from 'lodash';

function extractApiBuilderResourceOperations(
  resources: ApiBuilderResource[],
): Record<string, ApiBuilderOperation[]> {
  const mapped = map(resources, (resource) => resource.operations);
  const flattened = flatten(mapped);
  return groupBy(flattened, (operation) => operation.path);
}

export default extractApiBuilderResourceOperations;
