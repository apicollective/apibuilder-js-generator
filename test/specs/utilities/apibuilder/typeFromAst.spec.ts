import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderService,
  ApiBuilderUnion,
  astFromTypeName,
  typeFromAst,
} from '../../../../src/utilities/apibuilder';

import apidocApiJson from '../../../fixtures/schemas/apidoc-api.json';

const service = new ApiBuilderService({ service: apidocApiJson });

describe('typeFromAst', () => {
  test('should return instance corresponding to "string" type', () => {
    const ast = astFromTypeName('string');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderPrimitiveType);
  });

  test('should return instance corresponding to "map[string]" type', () => {
    const ast = astFromTypeName('map[string]');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderMap);
    expect((instance as ApiBuilderMap).ofType).toBeInstanceOf(ApiBuilderPrimitiveType);
  });

  test('should return instance corresponding to "[string]" type', () => {
    const ast = astFromTypeName('[string]');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderArray);
    expect((instance as ApiBuilderArray).ofType).toBeInstanceOf(ApiBuilderPrimitiveType);
  });

  test('should return instance corresponding to model type', () => {
    const ast = astFromTypeName('com.bryzek.apidoc.api.v0.models.application');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderModel);
  });

  test('should return instance corresponding to enum type', () => {
    const ast = astFromTypeName('com.bryzek.apidoc.api.v0.enums.visibility');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderEnum);
  });

  test('should return instance corresponding to union type', () => {
    const ast = astFromTypeName('com.bryzek.apidoc.api.v0.unions.diff');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderUnion);
  });

  test('should throw when specified type does not exist', () => {
    expect(() => {
      const ast = astFromTypeName('com.bryzek.apidoc.api.v0.models.superhero');
      typeFromAst(ast, service);
    }).toThrow();
  });
});
