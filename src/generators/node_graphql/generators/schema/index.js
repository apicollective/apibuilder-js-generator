const path = require('path');
const GraphQLSchemaConfig = require('../../utilities/GraphQLSchemaConfig');
const { renderTemplate } = require('../../../../utilities/template');

/**
 * Generates source file content for API Builder enum types.
 * @param {Service} service
 */
function generate(service) {
  const templatePath = path.resolve(__dirname, './templates/schema.ejs');
  const config = GraphQLSchemaConfig.fromService(service);
  return renderTemplate(templatePath, config)
}

module.exports = generate;
