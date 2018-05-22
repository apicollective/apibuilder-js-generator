const fs = require('fs');
const path = require('path');

module.exports = function loadFixture(...paths) {
  const filepath = path.join(...paths);
  return fs.readFileSync(filepath, 'utf8');
};
