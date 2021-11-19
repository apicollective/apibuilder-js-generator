import supertest from 'supertest';
import defaults from 'lodash/defaults';
import app from '../../../src/server/app';

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

function conformsToGeneratorInterface(value) {
  expect(defaults(value, {
    description: 'No description provided',
    language: 'No language provided',
  })).toEqual({
    key: expect.any(String),
    name: expect.any(String),
    language: expect.any(String),
    description: expect.any(String),
    attributes: expect.any(Array),
  });
}

describe('GET /generators', () => {
  test('lists available generators', async () => {
    const response = await request.get('/generators');
    expect(response.statusCode).toBe(200);
    expect(response.type).toBe('application/json');
    response.body.forEach(conformsToGeneratorInterface);
  });
});

describe('GET /generators/:key', () => {
  generatorKeys.forEach((key) => {
    test(key, async () => {
      const response = await request.get(`/generators/${key}`);
      expect(response.statusCode).toBe(200);
      expect(response.type).toBe('application/json');
      conformsToGeneratorInterface(response.body);
    });
  });
});
