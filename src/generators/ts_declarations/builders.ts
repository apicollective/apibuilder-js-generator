import { builders as b, namedTypes } from 'ast-types';
import debug from 'debug';
import {
  buildModuleDeclarations,
  buildTypeIdentifier,
  buildTypeReference,
  Context,
} from '../../builders';

import shortNameCompare from '../../utilities/shortNameCompare';

const log = debug('apibuilder:ts_declarations');

function buildExportNameDeclarations(
  context: Context,
): namedTypes.ExportNamedDeclaration[] {
  const { rootService } = context;

  const types = []
    .concat(rootService.enums)
    .concat(rootService.models)
    .concat(rootService.unions);

  return types.sort(shortNameCompare).map(
    type => b.exportNamedDeclaration(
      b.tsTypeAliasDeclaration(buildTypeIdentifier(type), buildTypeReference(type)),
    ),
  );
}

export function buildFile(
  context: Context,
): namedTypes.File {
  if (context.unresolvedTypes.length) {
    log(
      'WARN: the following types could not be resolved and will be ignored '
      + `${JSON.stringify(context.unresolvedTypes)}`,
    );
  }

  return b.file(
    b.program([
      ...buildModuleDeclarations(context),
      ...buildExportNameDeclarations(context),
    ]),
  );
}
