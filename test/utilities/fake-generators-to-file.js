const fs = require('fs');
const path = require('path');

const fakeGenerators = require('../../src/generators/fake_generators');
const apiServiceJson = require('./api.service.json');
const ensurePath = require('../../src/utilities/apibuilder/utilities/ensure-path');

async function doIt() {
  const files = await fakeGenerators.generate(apiServiceJson);
  const basePath = path.join(__dirname, '../../dist/api');
  files.forEach(async ({ name, contents }) => {
    const fullPath = path.resolve(basePath, name);
    try {
      await ensurePath(fullPath.substring(0, fullPath.lastIndexOf('/')));
      fs.writeFileSync(fullPath, contents);
    } catch (err) {
      console.log(err);
    }
  });
}

doIt().catch(e => console.log(e));
