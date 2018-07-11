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
const toModuleName = require('./utilities/toModuleName');

const debug = createLogger('apibuilder:prop-types');

function generate({ service: data }) {
  const service = new ApiBuilderService({ service: data });

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
  ]);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
