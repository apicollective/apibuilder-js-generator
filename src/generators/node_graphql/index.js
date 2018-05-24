const createLogger = require('debug');
const reduce = require('lodash/reduce');

const File = require('../../utilities/apibuilder/File');
const Service = require('../../utilities/apibuilder/Service');
const generateEnumeration = require('./generators/enumeration');
const generateModel = require('./generators/model');
const toDefaultExport = require('./utilities/toDefaultExport');
const generateSchema = require('./generators/schema')

const debug = createLogger('apibuilder:graphql');

function generate(data) {
  const service = new Service({ service: data });

  const generatedEntities = reduce(service.internalEntities, (files, entity) => {
    debug(`Generating source code for "${entity.fullyQualifiedName}".`);

    let contents;

    if (entity.isEnum) {
      contents = generateEnumeration(entity);
    } else if (entity.isModel) {
      contents = generateModel(entity);
    } else {
      debug('Skipping because type is not supported');
      return files;
    }

    const basename = `${toDefaultExport(entity)}.js`;
    const dirname = entity.packageName.split('.').join('/');
    const file = new File(basename, dirname, contents);

    return files.concat(file);
  }, []);

  const generatedSchema = new File('schema.js', service.namespace.split('.').join('/'), generateSchema(service));

  return Promise.resolve(generatedEntities.concat(generatedSchema));
}

module.exports = { generate };
