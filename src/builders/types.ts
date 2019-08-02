import {
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderService,
  ApiBuilderServiceConfig,
  ApiBuilderUnion,
} from 'apibuilder-js';

// tslint:disable-next-line: interface-name
export interface InvocationForm {
  readonly service: ApiBuilderServiceConfig;
  readonly attributes: Record<string, string>;
  readonly user_agent?: string;
  readonly imported_services?: ApiBuilderServiceConfig[];
}

export type TypeRecord = Record<string, (ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion)>;

// tslint:disable-next-line: interface-name
export interface Context {
  /**
   * This property holds types indexed by their fully qualified name.
   */
  typesByName: TypeRecord;
  /**
   * This property holds a list of fully qualified name for unresolved types.
   * A type is unresolved when its definitions cannot be derived from the
   * invocatino form.
   */
  unresolvedTypes: string[];
  /**
   * This property holds a list of fully qualified name for circular types.
   */
  cyclicTypes: string[];
  /**
   * This property holds an ordered list of fully qualified name for types
   * such that all dependencies come before the type in the ordering.
   */
  sortedTypes: string[];

  rootService: ApiBuilderService;

  importedServices: ApiBuilderService[];
}
