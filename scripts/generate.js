#!/usr/bin/env node

/* eslint-disable import/no-extraneous-dependencies */

if (!process.env.APIBUILDER_TOKEN) {
  throw new Error(
    'The APIBUILDER_TOKEN environment variable must be set '
    + 'to your APIBuilder token.'
  );
}

const debug = require('debug');
const program = require('commander');
const fs = require('fs');
const got = require('got');
const mkdirp = require('mkdirp');
const path = require('path');
const uniq = require('lodash/uniq');

const log = debug('apibuilder:generator');

let stdin = '';

// USAGE:
//
// $ apibuilder download flow api latest | ./script/generate.js --generator jsdoc --output ./generated
//
// $ ./scripts/generate.js ${cat api.json} --generator jsdoc --output ./generated

async function buildInvocationForm(schema) {
  const uris = uniq(schema.imports.map(({ organization, application }) => (
    `https://api.apibuilder.io/${organization.key}/${application.key}/latest`
  )));

  log(`fetching imported services from: ${JSON.stringify(uris)}`);

  const promises = uris.map((uri) => got.get(uri, {
    json: true,
    headers: {
      authorization: `Basic ${new Buffer(process.env.APIBUILDER_TOKEN).toString('base64')}`,
    },
  }));
  const responses = await Promise.all(promises);
  const importedServices = responses.map(response => response.body.service);
  return {
    attributes: [],
    imported_services: importedServices,
    service: schema,
  };
}

async function generate(schema, options = {}) {
  const { generator, output } = options;
  const url = `http://localhost:7050/invocations/${generator}`;
  const invocationForm = await buildInvocationForm(schema);

  log(`sending POST with invocation form to "${url}"`);

  const response = await got.post(url, {
    json: true,
    body: invocationForm,
  });

  response.body.files.forEach((file) => {
    const destinationPath = path.resolve(program.output, file.dir, file.name);
    log(`Writing to "${path.relative(process.cwd(), destinationPath)}"`);
    mkdirp.sync(path.dirname(destinationPath));
    fs.writeFileSync(destinationPath, file.contents);
  });
}

program
  .version('0.1.0')
  .arguments('[schema]')
  .option('--generator [generator]', 'name of generator to invoke', 'prop_types')
  .option('--output [output]', 'path to directory where files will be generated', path.resolve(process.cwd(), './generated'))
  .action((schema, options) => {
    if (stdin) schema = stdin;
    schema = JSON.parse(schema);
    generate(schema, options).catch(console.error);
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
