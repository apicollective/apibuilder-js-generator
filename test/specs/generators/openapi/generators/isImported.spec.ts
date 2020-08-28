import {
  ApiBuilderService,
} from 'apibuilder-js';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');
import { isTypeImported } from '../../../../../src/generators/openapi/generators/openapi-utils';

describe('service', () => {
  const service = new ApiBuilderService(apidocApiJson);

  test('should check if types are imported', () => {
    const isImported = isTypeImported(service)
    expect(isImported(service.findTypeByName('organization'))).toBeFalsy();
    expect(isImported(service.findTypeByName('com.bryzek.apidoc.common.v0.models.audit'))).toBeTruthy();
  });
});