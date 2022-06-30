#!/usr/bin/env node

/**
 * Usage:
 * apibuilder code apicollective apibuilder-api latest form | ./scripts/generate.js
 * apibuilder code apicollective apibuilder-api latest form | ./scripts/generate.js --generator ts_declarations
 */

const debug = require('debug');
const program = require('commander');
const fs = require('fs');
const got = require('got');
const mkdirp = require('mkdirp');
const path = require('path');

const log = debug('apibuilder:generator');

let stdin = '';

async function postInvocationForm(invocationForm, options = {}) {
  const { generator, output } = options;
  const url = `http://localhost:7050/invocations/${generator}`;

  log(`sending POST with invocation form to "${url}"`);

  const response = await got.post(url, {
    json: true,
    body: invocationForm,
  });

  response.body.files.forEach((file) => {
    const destinationPath = path.resolve(program.output, file.dir || '.', file.name);
    log(`Writing to "${path.relative(process.cwd(), destinationPath)}"`);
    mkdirp.sync(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, file.contents);
  });
}

program
  .version('0.1.0')
  .arguments('[invocationForm]')
  .option('--generator [generator]', 'name of generator to invoke', 'prop_types')
  .option('--output [output]', 'path to directory where files will be generated', path.resolve(process.cwd(), './generated'))
  .action((invocationForm, options) => {
    if (stdin) invocationForm = stdin;
    invocationForm = JSON.parse(invocationForm);
    postInvocationForm(invocationForm, options).catch(console.error);
  })


if (process.stdin.isTTY) {
  program.parse(process.argv);
} else {
  process.stdin.setEncoding('utf8');

  process.stdin.on('readable', () => {
    while ((chunk = process.stdin.read()) != null) {
      stdin += chunk;
    }
  });

  process.stdin.on('end', () => {
    program.parse(process.argv);
  });
}
