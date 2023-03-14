/* eslint-disable import/prefer-default-export */
import { builders as b, namedTypes } from 'ast-types';
import { camelCase } from 'lodash';
import { buildModuleDeclarations, buildTypeReference, Context } from '../../builders';
import { safeIdentifier } from './builders';

export function buildTypeDeclarationFile(context: Context): namedTypes.File {
  const { rootService, unresolvedTypes } = context;
  const modules = buildModuleDeclarations(context);
  const types = [
    ...rootService.enums,
    ...rootService.models,
    ...rootService.unions,
  ];

  const declarations = types
    .filter((type) => !unresolvedTypes.includes(type.fullName))
    .map((type) => b.exportNamedDeclaration.from({
      declaration: {
        declarations: [
          b.variableDeclarator.from({
            id: b.identifier.from({
              name: safeIdentifier(camelCase(type.shortName)),
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsTypeReference.from({
                  typeName: b.tsQualifiedName(
                    b.identifier('PropTypes'),
                    b.identifier('Requireable'),
                  ),
                  typeParameters: b.tsTypeParameterInstantiation.from({
                    params: [buildTypeReference(type)],
                  }),
                }),
              }),
            }),
          }),
        ],
        kind: 'const',
        type: 'VariableDeclaration',
      },
    }));

  return b.file(b.program([
    b.importDeclaration(
      [b.importDefaultSpecifier(b.identifier('PropTypes'))],
      b.literal('prop-types'),
    ),
    ...modules,
    ...declarations,
  ]));
}
