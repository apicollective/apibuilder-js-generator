const find = require('lodash/find');
const Model = require('../../../../src/utilities/apibuilder/Model');
const Service = require('../../../../src/utilities/apibuilder/Service');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new Service({ service: schema });

describe('Model', () => {
  test('should have property with fully qualified name', () => {
    const application = find(schema.models, { name: 'application' });
    const model = Model.fromSchema(application, service);
    expect(model).toHaveProperty('fullyQualifiedName', 'com.bryzek.apidoc.api.v0.models.application');
  });
});
