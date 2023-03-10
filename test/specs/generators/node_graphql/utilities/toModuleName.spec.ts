import find from 'lodash/find';

import toModuleName from '../../../../../src/generators/node_graphql/utilities/toModuleName';
import { ApiBuilderModel, ApiBuilderService, FullyQualifiedType } from '../../../../../src/utilities/apibuilder';
import apidocApiJson from '../../../../fixtures/schemas/apidoc-api.json';

const service = new ApiBuilderService({ service: apidocApiJson });

describe('toModuleName', () => {
  test('should return module name for enum', () => {
    const enumeration = find(service.enums, { shortName: 'original_type' });
    expect(toModuleName(enumeration)).toBe('com/bryzek/apidoc/api/v0/enums/OriginalType');
  });

  test('should return module name for model', () => {
    const model = find(service.models, { shortName: 'attribute_value_form' });
    expect(toModuleName(model)).toBe('com/bryzek/apidoc/api/v0/models/AttributeValueForm');
  });

  test('should return module name for union', () => {
    const union = find(service.unions, { shortName: 'item_detail' });
    expect(toModuleName(union)).toBe('com/bryzek/apidoc/api/v0/unions/ItemDetail');
  });

  test('should allow reserved words as file basename', () => {
    const model = new ApiBuilderModel(
      {
        fields: [],
        name: 'export',
        plural: 'exports',
      },
      new FullyQualifiedType('io.flow.api.v0.models.export'),
      service,
    );
    expect(toModuleName(model)).toBe('io/flow/api/v0/models/Export');
  });
});
