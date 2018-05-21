const createLogger = require('debug');
const reduce = require('lodash/reduce');
const path = require('path');

const File = require('../../utilities/apibuilder/File');
const Service = require('../../utilities/apibuilder/Service');
const generateEnumeration = require('./generators/generator-enumeration');
const generateModel = require('./generators/generator-model');
const generateUnion = require('./generators/generator-union');
const toModuleName = require('./utilities/toModuleName');

const debug = createLogger('prop_types');

function generate(data) {
  const service = new Service({ service: data });
  const generatedFiles = reduce(service.internalEntities, (files, entity) => {
    let contents;

    if (entity.isEnum) {
      contents = generateEnumeration(entity);
    } else if (entity.isModel) {
      contents = generateModel(entity);
    } else if (entity.isUnion) {
      contents = generateUnion(entity);
    } else {
      debug(`Skipping code generation for ${entity.fullyQualifiedName} because is not supported`);
      return files;
    }

    debug(`Code generated for ${entity.fullyQualifiedName}`);

    const filepath = toModuleName(entity);
    const basename = `${path.basename(filepath)}.js`;
    const dirname = path.dirname(filepath);
    const file = new File(basename, dirname, contents);

    return files.concat(file);
  }, []);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
