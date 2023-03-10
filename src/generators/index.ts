import nodeZeroTwelve from './0_12';
import jsIsomorphic from './js_isomorphic';
import jsdoc from './jsdoc';
import nodeFiveEs5 from './node_5_es5';
import nodeFiveEs6 from './node_5_es6';
import openapi from './openapi';
import propTypes from './prop_types';
import tsConstants from './ts_constants';
import tsDeclarations from './ts_declarations';
import tsDeclarationsV2 from './ts_declarations_v2';
import tsMocks from './ts_mocks';
import tsPropTypes from './ts_prop_types';
import tsSdk from './ts_sdk';
import tsSdkv2 from './ts_sdk_v2';

const generators = {
  node_0_12: {
    key: 'node_0_12',
    name: 'Node (0.12.x)',
    language: 'JavaScript',
    description: 'Node client using the request http lib',
    attributes: [],
    generator: nodeZeroTwelve,
  },

  node_5_es5: {
    key: 'node_5_es5',
    name: 'Node (5.x.x)',
    language: 'JavaScript',
    description: 'Node 5 client - compiled version of node_5_es6',
    attributes: [],
    generator: nodeFiveEs5,
  },

  node_5_es6: {
    key: 'node_5_es6',
    name: 'Node (5.x.x) ES6 / Babel',
    language: 'JavaScript',
    description: 'Node 5 client written in ES6 (requires babel or other compiler)',
    attributes: [],
    generator: nodeFiveEs6,
  },

  js_isomorphic: {
    key: 'js_isomorphic',
    name: 'Javascript (Isomorphic)',
    language: 'JavaScript',
    description: 'Node 6 client written in ES6 (requires babel or other compiler).',
    attributes: [],
    generator: jsIsomorphic,
  },

  prop_types: {
    key: 'prop_types',
    name: 'React PropTypes',
    language: 'JavaScript',
    description: 'React PropTypes using es2017. Utilizes the `prop-types` npm module',
    attributes: [],
    generator: propTypes,
  },

  ts_prop_types: {
    key: 'ts_prop_types',
    name: 'PropType Validators',
    language: 'TypeScript',
    description: 'PropType Validators in TypeScript',
    attributes: [],
    generator: tsPropTypes,
  },

  ts_constants: {
    key: 'ts_constants',
    name: 'TypeScript Constants',
    description: 'Constant definitions using TypeScript',
    attributes: [],
    generator: tsConstants,
  },

  ts_sdk: {
    key: 'ts_sdk',
    name: 'TypeScript Services',
    description: 'Universal SDK in TypeScript',
    attributes: [],
    generator: tsSdk,
  },

  ts_sdk_v2: {
    key: 'ts_sdk_v2',
    name: 'TypeScript Services',
    description: 'Universal SDK in TypeScript without Flow Type declarations',
    attributes: [],
    generator: tsSdkv2,
  },

  jsdoc: {
    key: 'jsdoc',
    name: 'JSDoc 3 Type Definitions',
    description: 'JSDoc 3 type definitions for your ApiBuilder entities',
    attributes: [],
    generator: jsdoc,
  },

  openapi: {
    key: 'openapi',
    name: 'OpenAPI specification',
    description: 'OpenAPI specification 3.0, see https://swagger.io/specification/ for details',
    attributes: [],
    generator: openapi,
  },

  ts_declarations: {
    key: 'ts_declarations',
    name: 'TypeScript Declaration File',
    description: 'TypeScript declaration file covering enums, models and unions from Apibuilder',
    attributes: [],
    generator: tsDeclarations,
  },

  ts_declarations_v2: {
    key: 'ts_declarations_v2',
    name: 'TypeScript declaration file',
    description: 'Generates TypeScript declaration files with type information from API Builder services',
    attributes: [],
    generator: tsDeclarationsV2,
  },

  ts_mocks: {
    key: 'ts_mocks',
    name: 'TypeScript mock data generator',
    description: 'Mock data generator written in TypeScript',
    attributes: [],
    generator: tsMocks,
  },
};

export default generators;
