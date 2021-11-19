import bodyParser from 'body-parser';
import debug from 'debug';
import express from 'express';
import drop from 'lodash/drop';
import find from 'lodash/find';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import omit from 'lodash/omit';
import size from 'lodash/size';
import take from 'lodash/take';
import values from 'lodash/values';

import generators from '../generators';

const log = debug('apibuilder:generator');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

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
  const invocationForm = get(req, 'body');

  const generator = get(generators, [invocationKey, 'generator']);
  const service = get(invocationForm, 'service');

  if (!generator) {
    return res.status(409).send([
      {
        code: 'GENERATOR_NOT_FOUND',
        message: `Could not find generator with key: ${invocationKey}`,
      },
    ]);
  }

  if (!service) {
    return res.status(409).send([
      {
        code: 'SERVICE_PAYLOAD_NOT_FOUND',
        message: `Service json not found for key[${invocationKey}]. Expected body of request to` +
                 'be a service spec json file produced by https://app.apibuilder.io.',
      },
    ]);
  }

  const scrubbedInvocationForm = {
    attributes: keys(get(invocationForm, 'attributes')),
    imported_services: map(
      get(invocationForm, 'imported_services'),
      importedService => `${importedService.namespace}.${importedService.name}`,
    ),
    service: `${service.namespace}.${service.name}`,
    user_agent: get(invocationForm, 'user_agent'),
  };

  log(`INFO: Generating [${invocationKey}] with: ${JSON.stringify(scrubbedInvocationForm)}`);

  return generator.generate(invocationForm).then((files) => {
    log(`INFO: Completed code generation for ${invocationKey} (${size(files)} Files)`);
    res.send({
      files,
      source: '',
    });
  }).catch((error) => {
    log(`ERROR: Could not generate code for ${invocationKey}: ${error.message}`);
    // tslint:disable-next-line:no-console
    console.error(`Could not generate code for ${invocationKey}: ${error.message}`);
    // tslint:disable-next-line:no-console
    console.error(error.stack);

    res.status(409).send([
      {
        code: 'GENERATOR_ERROR',
        message: `Error in generator ${invocationKey}: ${error.message}\n${error.stack}`,
      },
    ]);
  });
});

export default app;
