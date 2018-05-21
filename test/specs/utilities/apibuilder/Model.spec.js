const find = require('lodash/find');
const Model = require('../../../../src/utilities/apibuilder/Model');
const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });
const { namespace } = schema;
const application = find(schema.models, { name: 'application' });

describe.skip('Model', () => {
  test('should have property with fully qualified name', () => {
    const model = new Model(application, namespace, service);
    expect(model).toHaveProperty('fullyQualifiedName', `${namespace}.models.application`);
  });
});
