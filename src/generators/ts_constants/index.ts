import {
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderService,
} from 'apibuilder-js';
import { builders } from 'ast-types';
import { print } from 'recast';

function buildFile(
  service: ApiBuilderService,
) {
  return builders.file(
    builders.program(
      service.enums.map((enumeration) => {
        return builders.exportNamedDeclaration(
          builders.tsEnumDeclaration(
            builders.identifier(enumeration.nickname),
            enumeration.values.map((value) => {
              return builders.tsEnumMember(
                builders.identifier(value.nickname),
                builders.stringLiteral(value.value),
              );
            }),
          ),
        );
      }),
    ),
  );
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return new Promise((resolve) => {
    const service = new ApiBuilderService(invocationForm.service);
    const ast = buildFile(service);
    const basename = `${service.applicationKey}.ts`;
    const dirname = service.namespace.split('.').join('/');
    const code = print(ast, {
      quote: 'single',
      tabWidth: 2,
      trailingComma: true,
      useTabs: false,
    }).code;
    resolve([
      new ApiBuilderFile(basename, dirname, code),
    ]);
  });
}
