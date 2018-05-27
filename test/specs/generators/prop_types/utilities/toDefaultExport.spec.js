const find = require('lodash/find');
const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toDefaultExport = require('../../../../../src/generators/prop_types/utilities/toDefaultExport');

const service = new ApiBuilderService({ service: schema });

describe('toDefaultExport', () => {
  test('should return default export name for enum', () => {
    const enumeration = find(service.enums, { shortName: 'original_type' });
    expect(toDefaultExport(enumeration)).toBe('originalTypePropTypes');
  });

  test('should return default export name for model', () => {
    const model = find(service.models, { shortName: 'attribute_value_form' });
    expect(toDefaultExport(model)).toBe('attributeValueFormPropTypes');
  });

  test('should return default export name for union', () => {
    const union = find(service.unions, { shortName: 'item_detail' });
    expect(toDefaultExport(union)).toBe('itemDetailPropTypes');
  });
});
