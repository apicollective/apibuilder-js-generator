import { ApiBuilderInvocationFormConfig, ApiBuilderFile } from 'apibuilder-js';
import bodyParser from 'body-parser';
import debug from 'debug';
import express, { Request } from 'express';
import get from 'lodash/get';
import keys from 'lodash/keys';
import map from 'lodash/map';
import omit from 'lodash/omit';

import generators from '../generators';
import { getQueryParamAsNumber } from './utilities';

const log = debug('apibuilder:generator');

const app = express();

app.use(bodyParser.json({ limit: '10mb' }));

app.get('/_internal_/healthcheck', (req, res) => {
  res.send('healthy');
});

app.get('/generators', (req, res) => {
  const offset = (req.query.offset != null && getQueryParamAsNumber(req.query, 'offset')) || 0;
  const limit = (req.query.limit != null && getQueryParamAsNumber(req.query, 'limit')) || 0;
  const summaries = Object.values(generators).map((generator) => omit(generator, 'generator'));

  res.send(summaries.slice(offset, offset + limit));
});

app.get('/generators/:key', (req, res) => {
  const key = get(req, 'params.key');
  const generator = Object.values(generators).find((gen) => gen.key === key);
  if (generator !== undefined) {
    const {
      generator: throwAway,
      ...rest
    } = generator;

    res.send(rest);
    return;
  }
  res.status(404).send();
});

app.post('/invocations/:key', (req: Request<{ key: keyof typeof generators }, any, ApiBuilderInvocationFormConfig>, res) => {
  const invocationKey = req.params.key;
  const invocationForm = req.body;

  const { generator } = generators[invocationKey];
  const { service } = invocationForm;

  if (!generator) {
    res.status(409).send([
      {
        code: 'GENERATOR_NOT_FOUND',
        message: `Could not find generator with key: ${invocationKey}`,
      },
    ]);
    return;
  }

  if (!service) {
    res.status(409).send([
      {
        code: 'SERVICE_PAYLOAD_NOT_FOUND',
        message: `Service json not found for key[${invocationKey}]. Expected body of request to`
                 + 'be a service spec json file produced by https://app.apibuilder.io.',
      },
    ]);
    return;
  }

  const scrubbedInvocationForm = {
    attributes: keys(get(invocationForm, 'attributes')),
    imported_services: map(
      get(invocationForm, 'imported_services'),
      (importedService) => `${importedService.namespace}.${importedService.name}`,
    ),
    service: `${service.namespace}.${service.name}`,
    user_agent: get(invocationForm, 'user_agent'),
  };

  log(`INFO: Generating [${invocationKey}] with: ${JSON.stringify(scrubbedInvocationForm)}`);

  if (!('generate' in generator)) {
    res.status(500).send();
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    generator.generate(invocationForm)
      .then((files: ApiBuilderFile[]) => {
        log(`INFO: Completed code generation for ${invocationKey} (${files.length} Files)`);
        res.send({
          files,
          source: '',
        });
      }).catch((error: { message: any; stack: any; }) => {
        log(`ERROR: Could not generate code for ${invocationKey}: ${String(error.message)}`);
        // tslint:disable-next-line:no-console
        console.error(`Could not generate code for ${invocationKey}: ${String(error.message)}`);
        // tslint:disable-next-line:no-console
        console.error(error.stack);

        res.status(409).send([
          {
            code: 'GENERATOR_ERROR',
            message: `Error in generator ${invocationKey}: ${String(error.message)}\n${String(error.stack)}`,
          },
        ]);
      });
  }
});

export default app;
