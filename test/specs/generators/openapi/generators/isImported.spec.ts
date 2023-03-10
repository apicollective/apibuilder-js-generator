import {
  ApiBuilderService, type ApiBuilderServiceConfig,
} from 'apibuilder-js';
import { isTypeImported } from '../../../../../src/generators/openapi/generators/openapi-utils';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');

describe('service', () => {
  const service = new ApiBuilderService(apidocApiJson as ApiBuilderServiceConfig);

  test('should check if types are imported', () => {
    const isImported = isTypeImported(service);
    expect(isImported(service.findTypeByName('organization'))).toBeFalsy();
    expect(isImported(service.findTypeByName('com.bryzek.apidoc.common.v0.models.audit'))).toBeTruthy();
  });
});
