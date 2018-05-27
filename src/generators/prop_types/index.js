const createLogger = require('debug');
const reduce = require('lodash/reduce');

const ApiBuilderFile = require('../../utilities/apibuilder/ApiBuilderFile');
const ApiBuilderService = require('../../utilities/apibuilder/ApiBuilderService');
const generateEnumeration = require('./generators/generator-enumeration');
const generateModel = require('./generators/generator-model');
const generateUnion = require('./generators/generator-union');
const toModuleName = require('./utilities/toModuleName');

const debug = createLogger('prop_types');

function generate(data) {
  const service = new ApiBuilderService({ service: data });
  const generatedFiles = reduce(service.internalTypes, (files, type) => {
    debug(`Generating source code for "${type.baseType}".`);

    let contents;

    if (type.isEnum) {
      contents = generateEnumeration(type);
    } else if (type.isModel) {
      contents = generateModel(type);
    } else if (type.isUnion) {
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
