const createLogger = require('debug');
const reduce = require('lodash/reduce');

const File = require('../../utilities/apibuilder/File');
const ApiBuilderService = require('../../utilities/apibuilder/ApiBuilderService');
const generateEnumeration = require('./generators/generator-enumeration');
const generateModel = require('./generators/generator-model');
const generateUnion = require('./generators/generator-union');
const toModuleName = require('./utilities/toModuleName');

const debug = createLogger('prop_types');

function generate(data) {
  const service = new ApiBuilderService({ service: data });
  const generatedFiles = reduce(service.internalEntities, (files, entity) => {
    debug(`Generating source code for "${entity.baseType}".`);

    let contents;

    if (entity.isEnum) {
      contents = generateEnumeration(entity);
    } else if (entity.isModel) {
      contents = generateModel(entity);
    } else if (entity.isUnion) {
      contents = generateUnion(entity);
    } else {
      debug('Skipping because type is not supported');
      return files;
    }

    const basename = `${toModuleName(entity)}.js`;
    const dirname = 'prop-types';
    const file = new File(basename, dirname, contents);

    return files.concat(file);
  }, []);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
