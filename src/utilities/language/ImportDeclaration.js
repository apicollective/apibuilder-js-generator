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

    let string;

    if (defaultExport) {
      string = `const ${defaultExport} = require('${moduleName}');`;
    } else if (namedExports && namedExports.length) {
      string = `const { ${namedExports.join(', ')} } = require('${moduleName}');`;
    } else {
      string = `require('${moduleName}');`;
    }

    return string;
  }
}

module.exports = ImportDeclaration;
