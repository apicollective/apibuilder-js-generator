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
  return new Promise((resolve) => {
    const service = new ApiBuilderService(form.service);
    const importedServices = form.imported_services != null
      ? form.imported_services.map(importedService => new ApiBuilderService(importedService))
      : [];
    const ast = buildFile(service, importedServices);
    const basename = `${service.applicationKey}.ts`;
    const dirname = service.namespace.split('.').join('/');
    resolve([
      new ApiBuilderFile(basename, dirname, format(print(ast).code, {
        parser: 'typescript',
        singleQuote: true,
        trailingComma: 'es5',
      })),
    ]);
  });
}
