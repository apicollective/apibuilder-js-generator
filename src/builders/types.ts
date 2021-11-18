import {
  ApiBuilderEnum,
  ApiBuilderModel,
  ApiBuilderService,
  ApiBuilderUnion,
} from 'apibuilder-js';

export type TypeRecord = Record<string, (ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion)>;

export type DependencyRecord = Record<string, Set<string>>;

// tslint:disable-next-line: interface-name
export interface Context {
  /**
   * Types that can be generated.
   */
  allowTypes: Set<string>;
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
