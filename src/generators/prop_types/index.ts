import { ApiBuilderFile, ApiBuilderInvocationFormConfig } from 'apibuilder-js';
import debug from 'debug';
import { print } from 'recast';

import { buildContext, Context } from '../../builders';
import { buildFile } from './builders';
import { buildTypeDeclarationFile } from './declarations';

const log = debug('apibuilder:ts_prop_types');

function generatePropTypes(
  context: Context,
): ApiBuilderFile {
  const { rootService } = context;
  log('INFO: Building AST for prop type validators...');
  const ast = buildFile(context);
  log('INFO: Transforming AST to code...');
  const code = print(ast, {
    quote: 'single',
    tabWidth: 2,
    trailingComma: true,
    useTabs: false,
  }).code;
  const basename = `${rootService.applicationKey}.js`;
  const dirname = rootService.namespace.split('.').join('/');
  const file = new ApiBuilderFile(basename, dirname, code);
  log('INFO: File created successfully!');
  return file;
}

function generateTypeDeclarations(
  context: Context,
): ApiBuilderFile {
  const { rootService } = context;
  log('INFO: Building AST for type declaration file...');
  const ast = buildTypeDeclarationFile(context);
  log('INFO: Transforming AST to code...');
  const code = print(ast, {
    quote: 'single',
    tabWidth: 2,
    trailingComma: true,
    useTabs: false,
  }).code;
  const basename = `${rootService.applicationKey}.d.ts`;
  const dirname = rootService.namespace.split('.').join('/');
  const file = new ApiBuilderFile(basename, dirname, code);
  log('INFO: File created successfully!');
  return file;
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return Promise.resolve().then(() => {
    log('INFO: Building context...');
    const context = buildContext(invocationForm);
    const files = [
      generatePropTypes(context),
      generateTypeDeclarations(context),
    ];
    log('INFO: Code generation completed!');
    return files;
  });
}
