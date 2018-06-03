const { astFromTypeName, typeNameFromAst } = require('../../../../src/utilities/apibuilder');

const baseType = 'com.bryzek.apidoc.common.v0.models.reference';

describe('typeNameFromAst', () => {
  test('string', () => {
    const ast = astFromTypeName('string');
    expect(typeNameFromAst(ast)).toEqual('string');
  });

  test('map[string]', () => {
    const ast = astFromTypeName('map[string]');
    expect(typeNameFromAst(ast)).toEqual('map[string]');
  });

  test('map[[string]]', () => {
    const ast = astFromTypeName('map[[string]]');
    expect(typeNameFromAst(ast)).toEqual('map[[string]]');
  });

  test(`map[map[map[[${baseType}]]]`, () => {
    const ast = astFromTypeName(`map[map[map[[${baseType}]]]]`);
    expect(typeNameFromAst(ast)).toEqual(`map[map[map[[${baseType}]]]]`);
  });

  test('[[[[string]]]]', () => {
    const ast = astFromTypeName('[[[[string]]]]');
    expect(typeNameFromAst(ast)).toEqual('[[[[string]]]]');
  });
});
