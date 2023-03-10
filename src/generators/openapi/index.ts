import { ApiBuilderFile, ApiBuilderInvocationFormConfig, ApiBuilderService } from 'apibuilder-js';
import generateOpenApiSpec from './generators/openapi-spec/generateOpenApiSpec';
/* uncomment for debugging */
// const debug = createLogger('apibuilder:openapi');

function generate(invocationForm: ApiBuilderInvocationFormConfig): Promise<ApiBuilderFile[]> {
  const service = new ApiBuilderService(invocationForm.service);
  const contentsData = generateOpenApiSpec(service);
  const contents = JSON.stringify(contentsData, null, 2);
  const file = new ApiBuilderFile('openapi.json', '', contents);

  return Promise.resolve([file]);
}

export default { generate };
