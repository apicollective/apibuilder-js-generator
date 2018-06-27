const express = require('express');
const bodyParser = require('body-parser');
const drop = require('lodash/drop');
const find = require('lodash/find');
const get = require('lodash/get');
const map = require('lodash/map');
const omit = require('lodash/omit');
const take = require('lodash/take');
const values = require('lodash/values');

const generators = require('../generators');

const app = express();
app.use(bodyParser.json({ limit: '5mb' }));

const port = process.env.APPLICATIN_PORT || 7050;

app.get('/_internal_/healthcheck', (req, res) => {
  res.send('healthy');
});

app.get('/generators', (req, res) => {
  const offset = get(req, 'query.offset', 0);
  const limit = get(req, 'query.limit', 10);
  const summaries = map(values(generators), generator => omit(generator, 'generator'));

  res.send(take(drop(summaries, offset), limit));
});

app.get('/generators/:key', (req, res) => {
  const generatorValues = map(values(generators), generator => omit(generator, 'generator'));
  const key = get(req, 'params.key');
  const summary = find(generatorValues, { key });

  if (summary) {
    res.send(summary);
  } else {
    res.status(404).send();
  }
});

app.post('/invocations/:key', (req, res) => {
  const invocationKey = get(req, 'params.key');
  const summary = get(generators, invocationKey, {});
  const { generator } = summary;
  const service = get(req, 'body.service');

  if (!generator) {
    return res.status(409).send([
      {
        code: 'GENERATOR_NOT_FOUND',
        message: `Could not find generator with key: ${invocationKey}`,
      },
    ]);
  }

  if (!service) {
    return res.status(422).send([
      {
        code: 'SERVICE_PAYLOAD_NOT_FOUND',
        message: `Serivce json not found for key[${invocationKey}]. Expected body of request to be a service spec json file produced by https://app.apibuilder.io.`,
      },
    ]);
  }

  console.log(`Generating with[${invocationKey}] for service[${service.namespace}.${service.name}]`);

  return generator.generate(service).then((files) => {
    res.send({
      source: '',
      files,
    });
  }).catch((error) => {
    console.error(`Could not generate code for ${invocationKey}: ${error.message}`);
    console.error(error.stack);

    res.status(409).send([
      {
        code: 'GENERATOR_ERROR',
        message: `Error in generator ${invocationKey}: ${error.message}\n${error.stack}`,
      }
    ]);
  });
});

app.listen(port, () => console.log(`apibuilder-javascript-generator listening on http://0.0.0.0:${port}`));
