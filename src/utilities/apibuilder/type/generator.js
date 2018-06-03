/**
 * Class representing a generated source file.
 * @see https://app.apibuilder.io/bryzek/apidoc-generator/latest#model-file
 */
class ApiBuilderFile {
  /**
   * Create a source file.
   * @param {String} basename The recommended name for the file, including the file extension.
   * @param {String} dirname The recommended directory path for the file where appropriate.
   * @param {String} contents The actual source code.
   */
  constructor(basename, dirname, contents) {
    this.name = basename;
    this.dir = dirname;
    this.contents = contents;
  }
}

exports.ApiBuilderFile = ApiBuilderFile;
