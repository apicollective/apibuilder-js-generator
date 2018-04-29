const mkdirp = require('mkdirp');

/**
 * Ensure the given directory exists on the file systems. Same as running `mkdir -p` in the shell.
 *
 * @param {String} directory - The directory to ensure exists.
 */
async function ensurePath(directory) {
  return new Promise((resolve, reject) => {
    mkdirp(directory, (error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
}

module.exports = ensurePath;
