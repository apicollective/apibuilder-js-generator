/**
 * @typedef {Object} ImportDeclarationConfig
 * @property {String} [defaultExport]
 * @property {String[]} namedExports
 * @property {String} moduleName
 */

class ImportDeclaration {
  /**
   * Creates an import declaration.
   * @param {ImportDeclarationConfig} config
   */
  constructor(config) {
    const { defaultExport, namedExports, moduleName } = config;

    Object.defineProperties(this, {
      defaultExport: {
        enumerable: true,
        value: defaultExport,
      },
      namedExports: {
        enumerable: true,
        value: namedExports,
      },
      moduleName: {
        enumerable: true,
        value: moduleName,
      },
    });
  }

  toString() {
    const { defaultExport, namedExports, moduleName } = this;

    let str;

    if (defaultExport) {
      str = `const ${defaultExport} = require('${moduleName}');`;
    } else if (namedExports && namedExports.length) {
      str = `const { ${namedExports.join(', ')} } = require('${moduleName}');`;
    } else {
      str = `require('${moduleName}');`;
    }

    return str;
  }
}

module.exports = ImportDeclaration;
