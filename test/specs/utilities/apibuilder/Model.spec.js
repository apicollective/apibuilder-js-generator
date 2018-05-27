const find = require('lodash/find');
const Model = require('../../../../src/utilities/apibuilder/Model');
const ApiBuilderService = require('../../../../src/utilities/apibuilder/ApiBuilderService');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

describe('Model', () => {
  test('should have property with base type', () => {
    const application = find(schema.models, { name: 'application' });
    const model = Model.fromSchema(application, service);
    expect(model).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should have property with package name', () => {
    const application = find(schema.models, { name: 'application' });
    const model = Model.fromSchema(application, service);
    expect(model).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.models');
  });
});
