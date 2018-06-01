const find = require('lodash/find');

const { ApiBuilderModel, ApiBuilderService } = require('../../../../src/utilities/apibuilder');
const schema = require('../../../fixtures/schemas/apidoc-api.json');

const service = new ApiBuilderService({ service: schema });

describe('ApiBuilderModel', () => {
  test('should have property with base type', () => {
    const application = find(schema.models, { name: 'application' });
    const model = ApiBuilderModel.fromSchema(application, service);
    expect(model).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should have property with package name', () => {
    const application = find(schema.models, { name: 'application' });
    const model = ApiBuilderModel.fromSchema(application, service);
    expect(model).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.models');
  });
});
