import {
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderService,
} from 'apibuilder-js';

import {
  builders as b,
  namedTypes,
} from 'ast-types';

import { print } from 'recast';

import {
  buildContext,
  buildModuleDeclarationsFromService,
  Context,
} from '../../builders';

function buildFile(
  service: ApiBuilderService,
  context: Context,
): namedTypes.File {
  return b.file.from({
    program: b.program.from({
      body: buildModuleDeclarationsFromService(service, context),
    }),
  });
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return new Promise((resolve) => {
    const files: ApiBuilderFile[] = [];
    const context = buildContext(invocationForm);

    // Create a declaration file for each service to avoid duplicate
    // declaration errors when generating multiple services that depend
    // on the same imported services.
    context.importedServices
      .concat(context.rootService)
      .forEach((service) => {
        const ast = buildFile(service, context);
        const basename = `${service.applicationKey}.d.ts`;
        const dirname = service.namespace.split('.').join('/');
        const { code } = print(ast, {
          quote: 'single',
          tabWidth: 2,
          trailingComma: true,
          useTabs: false,
        });
        const file = new ApiBuilderFile(basename, dirname, code);
        files.push(file);
      });

    resolve(files);
  });
}
