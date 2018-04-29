const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const curry = require('lodash/fp/curry');
const DebugLogger = require('debug');

const ensurePath = require('../utilities/ensure-path');

const debug = DebugLogger('apibuilder:generators');

const writeFile = promisify(fs.writeFile);

/**
 * Write a GeneratedFile object to the filesystem. Creates the directory the file will live in if
 * it does not exist already
 *
 * @param {String} basePath - The base path for the file, aka __dirname + 'src'
 * @param {GeneratedFile} file - a GeneratedFile object.
 */
async function writeGeneratedFile(basePath, file) {
  const srcPath = path.resolve(basePath, file.path);
  await ensurePath(srcPath.substring(0, srcPath.lastIndexOf('/')));

  debug(`[writeGeneratedFile] srcPath[${srcPath}]`);

  return writeFile(srcPath, file.contents);
}

module.exports = curry(writeGeneratedFile);
