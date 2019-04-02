import {
  ApiBuilderEnum,
  ApiBuilderService,
} from 'apibuilder-js';
import {
  generateSchemaEnums,
  generateSchemaFromEnum,
} from '../../../../../src/generators/openapi/generators/openapi-schemas';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');
import enumJson = require('../../../../fixtures/schemas/enum.json');
import serviceJson = require('../../../../fixtures/schemas/service.json');

describe('generate schema enums', () => {
  const service = new ApiBuilderService(apidocApiJson);
  const schemaEnums = generateSchemaEnums(service);

  test('should return an array of enums given a service', () => {
    expect(Array.isArray(schemaEnums)).toBe(true);
  });
});

describe('generate schema enum', () => {
  const dayOfWeekEnum = {
    day_of_week: {
      enum: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      type: 'string',
    },
  };
  test('should generate a valid schema from an enum', () => {
    const service = new ApiBuilderService(serviceJson);
    const dayOfWeek = ApiBuilderEnum.fromConfig(enumJson, service, 'test');
    const schemaEnum = generateSchemaFromEnum(dayOfWeek);
    const expected = dayOfWeekEnum;
    expect(schemaEnum).toEqual(expected);
  });

  test('should add a deprecated prop if present', () => {
    const service = new ApiBuilderService(serviceJson);
    const deprecatedDayOfWeekJson = Object.assign({}, { deprecation: true }, enumJson);
    const deprecatedDayOfWeek = ApiBuilderEnum.fromConfig(deprecatedDayOfWeekJson, service, 'test');
    const schemaEnum = generateSchemaFromEnum(deprecatedDayOfWeek);
    const expected = {
      day_of_week: Object.assign({}, { deprecated: true }, dayOfWeekEnum.day_of_week),
    };

    expect(schemaEnum).toEqual(expected);
  });

  test('should add a description prop if present', () => {
    const service = new ApiBuilderService(serviceJson);
    const description = { description: 'An enum for days of the week' };
    const descriptiveDayOfWeekJson = Object.assign({}, description, enumJson);
    const descriptiveDayOfWeek = ApiBuilderEnum.fromConfig(
      descriptiveDayOfWeekJson,
      service,
      'test',
    );
    const schemaEnum = generateSchemaFromEnum(descriptiveDayOfWeek);
    const expected = {
      day_of_week: Object.assign({}, description, dayOfWeekEnum.day_of_week),
    };

    expect(schemaEnum).toEqual(expected);
  });
});
