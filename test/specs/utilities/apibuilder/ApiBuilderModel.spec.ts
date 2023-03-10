import find from 'lodash/find';

import { ApiBuilderModel, ApiBuilderService } from '../../../../src/utilities/apibuilder';
import apidocApiJson from '../../../fixtures/schemas/apidoc-api.json';

const service = new ApiBuilderService({ service: apidocApiJson });

describe('ApiBuilderModel', () => {
  test('should have property with base type', () => {
    const application = find(apidocApiJson.models, { name: 'application' });
    const model = ApiBuilderModel.fromSchema(application, service);
    expect(model).toHaveProperty('baseType', 'com.bryzek.apidoc.api.v0.models.application');
  });

  test('should have property with package name', () => {
    const application = find(apidocApiJson.models, { name: 'application' });
    const model = ApiBuilderModel.fromSchema(application, service);
    expect(model).toHaveProperty('packageName', 'com.bryzek.apidoc.api.v0.models');
  });
});
