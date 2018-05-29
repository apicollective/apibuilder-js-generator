const ApiBuilderArray = require('../../../../src/utilities/apibuilder/ApiBuilderArray');
const ApiBuilderEnum = require('../../../../src/utilities/apibuilder/ApiBuilderEnum');
const ApiBuilderMap = require('../../../../src/utilities/apibuilder/ApiBuilderMap');
const ApiBuilderModel = require('../../../../src/utilities/apibuilder/ApiBuilderModel');
const ApiBuilderPrimitiveType = require('../../../../src/utilities/apibuilder/ApiBuilderPrimitiveType');
const ApiBuilderService = require('../../../../src/utilities/apibuilder/ApiBuilderService');
const ApiBuilderUnion = require('../../../../src/utilities/apibuilder/ApiBuilderUnion');
const astFromType = require('../../../../src/utilities/apibuilder/astFromType');
const typeFromAst = require('../../../../src/utilities/apibuilder/typeFromAst');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

describe.only('typeFromAst', () => {
  test('should return instance corresponding to "string" type', () => {
    const ast = astFromType('string');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderPrimitiveType);
  });

  test('should return instance corresponding to "map[string]" type', () => {
    const ast = astFromType('map[string]');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderMap);
    expect(instance.ofType).toBeInstanceOf(ApiBuilderPrimitiveType);
  });

  test('should return instance corresponding to "[string]" type', () => {
    const ast = astFromType('[string]');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderArray);
    expect(instance.ofType).toBeInstanceOf(ApiBuilderPrimitiveType);
  });

  test('should return instance corresponding to model type', () => {
    const ast = astFromType('com.bryzek.apidoc.api.v0.models.application');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderModel);
  });

  test('should return instance corresponding to enum type', () => {
    const ast = astFromType('com.bryzek.apidoc.api.v0.enums.visibility');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderEnum);
  });

  test('should return instance corresponding to union type', () => {
    const ast = astFromType('com.bryzek.apidoc.api.v0.unions.diff');
    const instance = typeFromAst(ast, service);
    expect(instance).toBeInstanceOf(ApiBuilderUnion);
  });

  test('should throw when specified type does not exist', () => {
    expect(() => {
      const ast = astFromType('com.bryzek.apidoc.api.v0.models.superhero');
      typeFromAst(ast, service);
    }).toThrow();
  });
});
