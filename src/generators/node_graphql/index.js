const createLogger = require('debug');
const reduce = require('lodash/reduce');

const File = require('../../utilities/apibuilder/File');
const Service = require('../../utilities/apibuilder/Service');
const generateEnumeration = require('./generators/enumeration');
const toDefaultExport = require('./utilities/toDefaultExport');

const debug = createLogger('apibuilder:graphql');

function generate(data) {
  const service = new Service({ service: data });
  const generatedFiles = reduce(service.internalEntities, (files, entity) => {
    debug(`Generating source code for "${entity.fullyQualifiedName}".`);

    let contents;

    if (entity.isEnum) {
      contents = generateEnumeration(entity);
    } else {
      debug('Skipping because type is not supported');
      return files;
    }

    const basename = `${toDefaultExport(entity.shortName)}.js`;
    const dirname = entity.packageName.split('.').join('/');
    const file = new File(basename, dirname, contents);

    return files.concat(file);
  }, []);

  return Promise.resolve(generatedFiles);
}

module.exports = { generate };
