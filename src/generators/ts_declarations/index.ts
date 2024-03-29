/* eslint-disable import/prefer-default-export */
import { ApiBuilderFile, ApiBuilderInvocationFormConfig } from 'apibuilder-js';
import debug from 'debug';
import { print } from 'recast';

import { buildContext } from '../../builders';
import { buildFile } from './builders';

const log = debug('apibuilder:ts_declarations');

export function generate(form: ApiBuilderInvocationFormConfig): Promise<ApiBuilderFile[]> {
  return new Promise((resolve) => {
    log('INFO: Building context...');
    const context = buildContext(form);
    log('INFO: Building AST...');
    const ast = buildFile(context);
    log('INFO: Transforming AST to code...');
    const basename = `${context.rootService.applicationKey}.ts`;
    const dirname = context.rootService.namespace.split('.').join('/');
    const { code } = print(ast, {
      quote: 'single',
      tabWidth: 2,
      trailingComma: true,
      useTabs: false,
    });
    log('INFO: Code generation completed!');
    resolve([
      new ApiBuilderFile(basename, dirname, code),
    ]);
  });
}

export default {
  generate,
};
