import path from 'path';
import supertest from 'supertest';
import app from '../../../src/server/app';
import { loadJSONFixture } from '../../helpers/loadFixture';

const request = supertest(app);

const generatorKeys = [
  'js_isomorphic',
  'jsdoc',
  'node_0_12',
  'node_5_es5',
  'node_5_es6',
  'openapi',
  'prop_types',
  'ts_constants',
  'ts_declarations_v2',
  'ts_declarations',
  'ts_prop_types',
  'ts_sdk_v2',
  'ts_sdk',
];

describe('POST /invocations/:key', () => {
  generatorKeys.forEach((key) => {
    test(key, async () => {
      const response = await request
        .post(`/invocations/${key}`)
        .send(loadJSONFixture('forms/apibuilder-api.json'));
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
      expect(response.body.source).toBe('');
      response.body.files.forEach((file) => {
        const target = path.format({
          dir: file.dir,
          base: file.name,
        });
        expect(file.contents).toMatchSnapshot(target);
      });
    });
  });
});
