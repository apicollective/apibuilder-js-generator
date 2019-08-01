import { ApiBuilderFile } from 'apibuilder-js';
import { print } from 'recast';
import debug from 'debug';

import { InvocationForm, buildContext } from '../../builders';
import { buildFile } from './builders';

const log = debug('apibuilder:ts_prop_types');

export function generate(
  invocationForm: InvocationForm,
): Promise<ApiBuilderFile[]> {
  return Promise.resolve().then(() => {
    log('INFO: Building context...');
    const context = buildContext(invocationForm);
    log('INFO: Building AST...');
    const ast = buildFile(context);
    log('INFO: Transforming AST to code...');
    const code = print(ast, {
      quote: 'single',
      tabWidth: 2,
      trailingComma: true,
      useTabs: false,
    }).code;
    const applicationKey = invocationForm.service.application.key;
    const namespace = invocationForm.service.namespace;
    const basename = `${applicationKey}.js`;
    const dirname = namespace.split('.').join('/');
    const file = new ApiBuilderFile(basename, dirname, code);
    log('INFO: Code generation completed!');
    return [file];
  });
}
