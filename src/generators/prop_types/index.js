const createLogger = require('debug');
const reduce = require('lodash/reduce');

const ApiBuilderFile = require('../../utilities/apibuilder/ApiBuilderFile');
const ApiBuilderService = require('../../utilities/apibuilder/ApiBuilderService');
const generateEnumeration = require('./generators/generator-enumeration');
const generateModel = require('./generators/generator-model');
const generateUnion = require('./generators/generator-union');
const isEnumType = require('../../utilities/apibuilder/isEnumType');
const isModelType = require('../../utilities/apibuilder/isModelType');
const isUnionType = require('../../utilities/apibuilder/isUnionType');
const toModuleName = require('./utilities/toModuleName');

const debug = createLogger('apibuilder:prop-types');

function generate(data) {
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
  }, []);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
