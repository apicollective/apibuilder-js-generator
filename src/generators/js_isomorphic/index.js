const codegen = require('./codegen');

function generate({ service }) {
  const client = codegen.generate(service);
  return Promise.resolve(
    client.files.map((file) => ({ name: file.path, contents: file.contents })),
  );
}

module.exports = { generate };
