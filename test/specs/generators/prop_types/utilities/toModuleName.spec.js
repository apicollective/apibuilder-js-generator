const find = require('lodash/find');

const { ApiBuilderService, ApiBuilderModel, FullyQualifiedType } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toModuleName = require('../../../../../src/generators/prop_types/utilities/toModuleName');

const service = new ApiBuilderService({ service: schema });

describe('toModuleName', () => {
  test('should return module name for enum', () => {
    const enumeration = find(service.enums, { shortName: 'original_type' });
    expect(toModuleName(enumeration)).toBe('com/bryzek/apidoc/api/v0/enums/originalType');
  });

  test('should return module name for model', () => {
    const model = find(service.models, { shortName: 'attribute_value_form' });
    expect(toModuleName(model)).toBe('com/bryzek/apidoc/api/v0/models/attributeValueForm');
  });

  test('should return module name for union', () => {
    const union = find(service.unions, { shortName: 'item_detail' });
    expect(toModuleName(union)).toBe('com/bryzek/apidoc/api/v0/unions/itemDetail');
  });

  test('should allow reserved words as file basename', () => {
    const model = new ApiBuilderModel({
      name: 'export',
      plural: 'exports',
      fields: [],
    }, new FullyQualifiedType('io.flow.api.v0.models.export'), service);
    expect(toModuleName(model)).toBe('io/flow/api/v0/models/export');
  });
});
