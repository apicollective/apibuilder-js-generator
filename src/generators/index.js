const nodeZeroTwelve = require('./0_12');
const nodeFiveEs5 = require('./node_5_es5');
const nodeFiveEs6 = require('./node_5_es6');
const jsIsomorphic = require('./js_isomorphic');
const propTypes = require('./prop_types');
const nodeGraphQL = require('./node_graphql');
const tsConstants = require('./ts_constants');
const tsDeclarations = require('./ts_declarations');
const tsDeclarationsV2 = require('./ts_declarations_v2');
const tsPropTypes = require('./ts_prop_types');
const tsSdk = require('./ts_sdk');
const tsDataDrivenForms = require('./ts_data_driven_forms');
const jsdoc = require('./jsdoc');
const openapi = require('./openapi');

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

  ts_data_driven_forms: {
    key: 'ts_data_driven_forms',
    name: 'Data Driven Forms Schemas',
    description: 'Generates Typescript Schema files for use with data driven forms, see https://data-driven-forms.org/',
    attributes: [],
    generator: tsDataDrivenForms,
  },
};

module.exports = generators;
