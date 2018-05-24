const ImportDeclaration = require('../../../../src/utilities/language/ImportDeclaration');

describe('ImportDeclaration', () => {
  test('should support default export declaration', () => {
    const instance = new ImportDeclaration({
      defaultExport: 'forEach',
      moduleName: 'lodash/forEach',
    });
    expect(instance.toString()).toBe("const forEach = require('lodash/forEach');");
  });

  test('should support named exports declaration', () => {
    const instance = new ImportDeclaration({
      namedExports: ['flatMap', 'forEach'],
      moduleName: 'lodash',
    });
    expect(instance.toString()).toBe("const { flatMap, forEach } = require('lodash');");
  });

  test('should support loading of module only', () => {
    const instance = new ImportDeclaration({ moduleName: 'lodash' });
    expect(instance.toString()).toBe("require('lodash');");
  });
});
