import {
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderService,
} from 'apibuilder-js';
import { builders } from 'ast-types';
import { format } from 'prettier';
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
                builders.stringLiteral(value.name),
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
    const content = format(print(ast).code, {
      parser: 'typescript',
      singleQuote: true,
      trailingComma: 'es5',
    });
    resolve([
      new ApiBuilderFile(basename, dirname, content),
    ]);
  });
}
