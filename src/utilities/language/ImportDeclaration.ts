export type ImportDeclarationConfig = {
  defaultExport?: string;
  namedExports: string[];
  moduleName: string;
}

export default class ImportDeclaration {
  public defaultExport?: string;
  public namedExports: string[];
  public moduleName: string;

  /**
   * Creates an import declaration.
   */
  constructor(config: ImportDeclarationConfig) {
    const { defaultExport, namedExports, moduleName } = config;

    this.defaultExport = defaultExport;
    this.namedExports = namedExports;
    this.moduleName = moduleName;
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
