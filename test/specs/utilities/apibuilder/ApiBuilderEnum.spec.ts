import find from 'lodash/find';

import { ApiBuilderEnum, ApiBuilderEnumValue, ApiBuilderService } from '../../../../src/utilities/apibuilder';
import apidocApiJson from '../../../fixtures/schemas/apidoc-api.json';
import createMockDeprecation from '../../../helpers/createMockDeprecation';
import createMockEnum from '../../../helpers/createMockEnum';

const service = new ApiBuilderService({ service: apidocApiJson });

describe('ApiBuilderEnum', () => {
  test('should have static function to create enumeration from schema', () => {
    const enumeration = find(apidocApiJson.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toBeInstanceOf(ApiBuilderEnum);
  });

  test('should define enum type with values', () => {
    const enumeration = find(apidocApiJson.enums, { name: 'visibility' });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    instance.values.forEach((value) => {
      expect(value).toBeInstanceOf(ApiBuilderEnumValue);
    });
  });

  test('should define deprecated enum type', () => {
    const enumeration = createMockEnum({ deprecation: createMockDeprecation() });
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('deprecation', enumeration.deprecation);
  });

  test('should define other properties from enum schema', () => {
    const enumeration = find(
      apidocApiJson.enums, { name: 'visibility' },
    ) as unknown as ApiBuilderEnum;
    const instance = ApiBuilderEnum.fromSchema(enumeration, service);
    expect(instance).toHaveProperty('name', enumeration.name);
    expect(instance).toHaveProperty('plural', enumeration.plural);
    expect(instance).toHaveProperty('description', enumeration.description);
    expect(instance).toHaveProperty('attributes', enumeration.attributes);
  });
});
