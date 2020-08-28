import { ApiBuilderEnum, ApiBuilderModel, ApiBuilderService, ApiBuilderUnion } from 'apibuilder-js';

export type IsImportedChecker =
  (type: ApiBuilderModel | ApiBuilderUnion | ApiBuilderEnum) => boolean;

export default function isTypeImported(service: ApiBuilderService): IsImportedChecker {
  return (type: ApiBuilderModel | ApiBuilderUnion | ApiBuilderEnum) => {
    return type.packageName !== service.namespace;
  };
}
