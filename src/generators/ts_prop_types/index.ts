import { ApiBuilderFile, ApiBuilderService, ApiBuilderServiceConfig } from 'apibuilder-js';
import debug from 'debug';
import { print } from 'recast';

import { buildFile } from './builders';

const log = debug('apibuilder:ts_prop_types');

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

    const basename = `${service.applicationKey}.ts`;

    const dirname = service.namespace.split('.').join('/');

    log('INFO: Building AST');

    const ast = buildFile(service, importedServices);

    log('INFO: Transforming AST to code');

    const code = print(ast, {
      quote: 'single',
      tabWidth: 2,
      trailingComma: true,
      useTabs: false,
    }).code;

    log('INFO: Code generation completed');

    resolve([
      new ApiBuilderFile(basename, dirname, code),
    ]);
  });
}