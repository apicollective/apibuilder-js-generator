#!/usr/bin/env node

const debug = require('debug');
const program = require('commander');
const fs = require('fs');
const got = require('got');
const mkdirp = require('mkdirp');
const path = require('path');

const log = debug('apibuilder:generator');

let serviceJson;

// generate --generator prop_types --source ./api-internal.json --output ./generated

program
  .version('0.1.0')
  .arguments('<source>')
  .option('--generator [generator]', 'name of generator to invoke', 'prop_types')
  .option('--output [output]', 'path to directory where files will be generated', path.resolve(process.cwd(), './generated'))
  .action((source) => {
    serviceJson = path.resolve(process.cwd(), source);
  })
  .parse(process.argv);

serviceJson = JSON.parse(fs.readFileSync(serviceJson, 'utf8'));

async function generate() {
  const url = `http://localhost:7050/invocations/${program.generator}`;
  const body = { service: serviceJson };
  log(`Sending POST with invocation form to "${url}"`);

  const response = await got.post(url, { json: true, body });

  response.body.files.forEach((file) => {
    const destinationPath = path.resolve(program.output, file.dir, file.name);
    log(`Writing to "${path.relative(process.cwd(), destinationPath)}"`);
    mkdirp.sync(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, file.contents);
  });
}


generate().catch(console.error);
