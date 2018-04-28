const path = require('path');
const { loadTemplate } = require('../util/handlebars');

const template = loadTemplate(path.join(__dirname, '../templates/logger.hbs'));

/**
 * Generates code for a logger. This generator does not depend on apidoc.
 *
 * @return {Object}                    Object containing file contents
 *                  files.contents     File contents
 *                  files.path         Path (recommended) of the file
 */
function generate() {
  const contents = template();
  const filePath = 'logger.js';

  return { contents, path: filePath };
}

module.exports = generate;
