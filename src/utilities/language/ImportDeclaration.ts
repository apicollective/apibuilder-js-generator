export interface IImportDeclarationConfig {
  defaultExport?: string;
  namedExports?: string[];
  moduleName: string;
}

export default class ImportDeclaration {
  public defaultExport?: string;
  public namedExports?: string[];
  public moduleName: string;

  /**
   * Creates an import declaration.
   */
  constructor(config: IImportDeclarationConfig) {
    const { defaultExport, namedExports, moduleName } = config;

    this.defaultExport = defaultExport;
    this.namedExports = namedExports;
    this.moduleName = moduleName;
  }

  public toString() {
    let str;

    if (this.defaultExport) {
      str = `const ${this.defaultExport} = require('${this.moduleName}');`;
    } else if (this.namedExports && this.namedExports.length) {
      str = `const { ${this.namedExports.join(', ')} } = require('${this.moduleName}');`;
    } else {
      str = `require('${this.moduleName}');`;
    }

    return str;
  }
}
