/**
 * Represents generated code to be eventually written to the filesystem.
 */
class GeneratedFile {
  constructor(filePath, contents) {
    this.path = filePath;
    this.contents = contents;
  }
}

module.exports = GeneratedFile;
