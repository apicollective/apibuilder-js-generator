const { ApiBuilderService, ApiBuilderModel, FullyQualifiedType } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toDefaultExport = require('../../../../../src/generators/prop_types/utilities/toDefaultExport');

const service = new ApiBuilderService({ service: schema });

describe('toDefaultExport', () => {
  test('should return default export name for enum', () => {
    const enumeration = service.findTypeByName('original_type');
    expect(toDefaultExport(enumeration)).toBe('originalType');
  });

  test('should return default export name for model', () => {
    const model = service.findTypeByName('attribute_value_form');
    expect(toDefaultExport(model)).toBe('attributeValueForm');
  });

  test('should return default export name for union', () => {
    const union = service.findTypeByName('item_detail');
    expect(toDefaultExport(union)).toBe('itemDetail');
  });

  test('should return safe identifier for reserved words', () => {
    const model = new ApiBuilderModel({
      name: 'export',
      plural: 'exports',
      fields: [],
    }, new FullyQualifiedType('io.flow.api.v0.models.export'), service);
    expect(toDefaultExport(model)).toBe('$export');
  });
});
