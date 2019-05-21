import { ApiBuilderFile, ApiBuilderService, ApiBuilderServiceConfig } from 'apibuilder-js';
import { format } from 'prettier';
import { print } from 'recast';
import { buildFile } from './builders';

// tslint:disable-next-line:interface-name
export interface InvocationForm {
  readonly service: ApiBuilderServiceConfig;
  readonly attributes: { [key: string]: string };
  readonly user_agent?: string;
  readonly imported_services?: ApiBuilderServiceConfig[];
}

export function generate(form: InvocationForm): Promise<ApiBuilderFile[]> {
  const { service: schema } = form;
  const service = new ApiBuilderService(schema);
  const ast = buildFile(service);
  return Promise.resolve([
    new ApiBuilderFile('index.ts', '.', format(print(ast).code, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'es5',
    })),
  ]);
}
