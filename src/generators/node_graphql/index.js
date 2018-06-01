const createLogger = require('debug');
const reduce = require('lodash/reduce');

const {
  ApiBuilderFile,
  ApiBuilderService,
  isEnumType,
  isModelType,
} = require('../../utilities/apibuilder');

const generateEnumeration = require('./generators/enumeration');
const generateModel = require('./generators/model');
const toDefaultExport = require('./utilities/toDefaultExport');

const debug = createLogger('apibuilder:graphql');

function generate(data) {
  const service = new ApiBuilderService({ service: data });
  const generatedFiles = reduce(service.internalTypes, (files, type) => {
    debug(`Generating source code for "${type.baseType}".`);

    let contents;

    if (isEnumType(type)) {
      contents = generateEnumeration(type);
    } else if (isModelType(type)) {
      contents = generateModel(type);
    } else {
      debug('Skipping because type is not supported');
      return files;
    }

    const basename = `${toDefaultExport(type)}.js`;
    const dirname = type.packageName.split('.').join('/');
    const file = new ApiBuilderFile(basename, dirname, contents);

    return files.concat(file);
  }, []);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
