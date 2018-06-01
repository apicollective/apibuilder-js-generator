const find = require('lodash/find');

const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toModuleName = require('../../../../../src/generators/prop_types/utilities/toModuleName');

const service = new ApiBuilderService({ service: schema });

describe('toModuleName', () => {
  test('should return module name for enum', () => {
    const enumeration = find(service.enums, { shortName: 'original_type' });
    expect(toModuleName(enumeration)).toBe('com/bryzek/apidoc/api/v0/enums/originalTypePropTypes');
  });

  test('should return module name for model', () => {
    const model = find(service.models, { shortName: 'attribute_value_form' });
    expect(toModuleName(model)).toBe('com/bryzek/apidoc/api/v0/models/attributeValueFormPropTypes');
  });

  test('should return module name for union', () => {
    const union = find(service.unions, { shortName: 'item_detail' });
    expect(toModuleName(union)).toBe('com/bryzek/apidoc/api/v0/unions/itemDetailPropTypes');
  });
});
