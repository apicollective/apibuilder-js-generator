import { ApiBuilderEnum, ApiBuilderModel, ApiBuilderUnion } from 'apibuilder-js';
import { builders as b, namedTypes } from 'ast-types';
import debug from 'debug';

import {
  Context,
  buildModuleDeclarations,
  buildTypeIdentifier,
  buildTypeReference,
} from '../../builders';

const log = debug('apibuilder:ts_declarations');

function stringCompare(s1: string, s2: string) {
  if (s1 > s2) return 1;
  if (s1 < s2) return -1;
  return 0;
}

function shortNameCompare(
  t1: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  t2: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): number {
  return stringCompare(t1.shortName, t2.shortName);
}

function buildExportNameDeclarations(
  context: Context,
): namedTypes.ExportNamedDeclaration[] {
  const { rootService } = context;
  const types = [].concat(rootService.enums).concat(rootService.models).concat(rootService.unions);
  return types.sort(shortNameCompare).map(
    type => b.exportNamedDeclaration(
      b.tsTypeAliasDeclaration(buildTypeIdentifier(type), buildTypeReference(type))
    ),
  );
}

export function buildFile(
  context: Context,
): namedTypes.File {
  if (context.unresolvedTypes.length) {
    log(`WARN: the following types could not be resolved and will be ignored ${JSON.stringify(context.unresolvedTypes)}`);
  }

  return b.file(
    b.program([
      ...buildModuleDeclarations(context),
      ...buildExportNameDeclarations(context),
    ])
  );
}
