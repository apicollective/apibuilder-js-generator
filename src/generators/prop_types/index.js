const createLogger = require('debug');
const reduce = require('lodash/reduce');

const {
  ApiBuilderFile,
  ApiBuilderService,
  isEnumType,
  isModelType,
  isUnionType,
} = require('../../utilities/apibuilder');

const generateEnumeration = require('./generators/generator-enumeration');
const generateModel = require('./generators/generator-model');
const generateUnion = require('./generators/generator-union');
const generateIndex = require('./generators/generator-index');
const generateMocks = require('./generators/generator-mocks');
const generateTypeDefinition = require('./generators/generator-type-definition');
const generateValidators = require('./generators/generator-validators');
const toModuleName = require('./utilities/toModuleName');

const debug = createLogger('apibuilder:prop-types');

function generate(invocationForm) {
  const service = new ApiBuilderService({ service: invocationForm.service });

  const generatedFiles = reduce(service.internalTypes, (files, type) => {
    debug(`Generating source code for "${type.baseType}".`);

    let contents;

    if (isEnumType(type)) {
      contents = generateEnumeration(type);
    } else if (isModelType(type)) {
      contents = generateModel(type);
    } else if (isUnionType(type)) {
      contents = generateUnion(type);
    } else {
      debug('Skipping because type is not supported');
      return files;
    }

    const basename = `${toModuleName(type)}.js`;
    const dirname = 'prop-types';
    const file = new ApiBuilderFile(basename, dirname, contents);

    return files.concat(file);
  }, [
    new ApiBuilderFile('index.js', 'prop-types', generateIndex(service.internalTypes, './prop-types')),
    new ApiBuilderFile('index.d.ts', 'prop-types', generateTypeDefinition(service)),
    new ApiBuilderFile('mocks.js', 'prop-types', generateMocks(service.internalTypes, './prop-types')),
    new ApiBuilderFile('validators.js', 'prop-types', generateValidators(service.internalTypes, './prop-types')),
  ]);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
