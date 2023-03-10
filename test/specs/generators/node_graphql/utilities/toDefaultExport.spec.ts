import toDefaultExport from '../../../../../src/generators/node_graphql/utilities/toDefaultExport';
import { ApiBuilderModel, ApiBuilderService, FullyQualifiedType } from '../../../../../src/utilities/apibuilder';
import apidocApiJson from '../../../../fixtures/schemas/apidoc-api.json';

const service = new ApiBuilderService({ service: apidocApiJson });

describe('toDefaultExport', () => {
  test('should return default export name for enum', () => {
    const enumeration = service.findTypeByName('original_type');
    expect(toDefaultExport(enumeration)).toBe('OriginalType');
  });

  test('should return default export name for model', () => {
    const model = service.findTypeByName('attribute_value_form');
    expect(toDefaultExport(model)).toBe('AttributeValueForm');
  });

  test('should return default export name for union', () => {
    const union = service.findTypeByName('item_detail');
    expect(toDefaultExport(union)).toBe('ItemDetail');
  });

  test('should return safe identifier for reserved words', () => {
    const model = new ApiBuilderModel(
      {
        fields: [],
        name: 'export',
        plural: 'exports',
      },
      new FullyQualifiedType('io.flow.api.v0.models.export'),
      service,
    );
    expect(toDefaultExport(model)).toBe('Export');
  });
});
