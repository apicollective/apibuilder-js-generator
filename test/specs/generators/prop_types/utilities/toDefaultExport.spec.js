const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toDefaultExport = require('../../../../../src/generators/prop_types/utilities/toDefaultExport');

const service = new ApiBuilderService({ service: schema });

describe('toDefaultExport', () => {
  test('should return default export name for enum', () => {
    const enumeration = service.findEnumByName('original_type');
    expect(toDefaultExport(enumeration)).toBe('OriginalType');
  });

  test('should return default export name for model', () => {
    const model = service.findModelByName('attribute_value_form');
    expect(toDefaultExport(model)).toBe('AttributeValueForm');
  });

  test('should return default export name for union', () => {
    const union = service.findUnionByName('item_detail');
    expect(toDefaultExport(union)).toBe('ItemDetail');
  });
});
