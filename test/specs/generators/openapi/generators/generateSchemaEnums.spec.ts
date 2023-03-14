import {
  ApiBuilderEnum,
  ApiBuilderService,
  type ApiBuilderServiceConfig,
} from 'apibuilder-js';
import {
  generateSchemaEnums,
  generateSchemaFromEnum,
} from '../../../../../src/generators/openapi/generators/openapi-schemas';
import apidocApiJson = require('../../../../fixtures/schemas/apidoc-api.json');
import enumJson = require('../../../../fixtures/schemas/enum.json');
import serviceJson = require('../../../../fixtures/schemas/service.json');

describe('generate schema enums', () => {
  const service = new ApiBuilderService(apidocApiJson as ApiBuilderServiceConfig);
  const schemaEnums = generateSchemaEnums(service);

  test('should return an array of enums given a service', () => {
    expect(Array.isArray(schemaEnums)).toBe(true);
  });
});

describe('generate schema enum', () => {
  const dayOfWeekEnum = {
    day_of_week: {
      description: 'Possible values: sunday,monday,tuesday,wednesday,thursday,friday,saturday.',
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
    const deprecatedDayOfWeekJson = {
      deprecation: {
        description: 'it\'s deprecated',
      },
      ...enumJson,
    };
    const deprecatedDayOfWeek = ApiBuilderEnum.fromConfig(deprecatedDayOfWeekJson, service, 'test');
    const schemaEnum = generateSchemaFromEnum(deprecatedDayOfWeek);
    const expected = {
      day_of_week: { deprecated: true, ...dayOfWeekEnum.day_of_week },
    };

    expect(schemaEnum).toEqual(expected);
  });

  test('should add a description prop if present', () => {
    const service = new ApiBuilderService(serviceJson);
    const description = 'An enum for days of the week.';
    const descriptiveDayOfWeekJson = {
      ...enumJson,
      description,
    };
    const descriptiveDayOfWeek = ApiBuilderEnum.fromConfig(
      descriptiveDayOfWeekJson,
      service,
      'test',
    );
    const schemaEnum = generateSchemaFromEnum(descriptiveDayOfWeek);
    const expected = {
      day_of_week: {
        ...dayOfWeekEnum.day_of_week,
        description: `${description} Possible values: sunday,monday,tuesday,wednesday,thursday,friday,saturday.`,
      },
    };

    expect(schemaEnum).toEqual(expected);
  });
});
