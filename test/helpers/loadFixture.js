const fs = require('fs');
const path = require('path');

const fixtureRoot = path.join(__dirname, '../fixtures');

/**
 * Join a path to the fixture root.
 * @param {...String} filepath
 * @returns {String}
 */
function fixturePath(...args) {
  let filepath = path.join(...args);

  if (!path.isAbsolute(filepath)) {
    filepath = path.join(fixtureRoot, filepath);
  }

  return filepath;
}

exports.fixturePath = fixturePath;

/**
 * Synchronously read file in the given path.
 * @param {...String} filepath
 */
function loadFixture(...args) {
  return fs.readFileSync(fixturePath(...args), 'utf8');
}

exports.loadFixture = loadFixture;

function loadJSONFixture(...args) {
  const fixture = loadFixture(...args);
  return JSON.parse(fixture);
}

exports.loadJSONFixture = loadJSONFixture;
