const find = require('lodash/find');

const { ApiBuilderService } = require('../../../../../src/utilities/apibuilder');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toImportStatement = require('../../../../../src/generators/prop_types/utilities/toImportStatement');

const service = new ApiBuilderService({ service: schema });

describe('toImportStatement', () => {
  test('should return import statement relative modules in the same "package"', () => {
    // com/bryzek/apidoc/api/v0/models/AttributeValueForm
    const source = find(service.models, { shortName: 'attribute_value_form' });
    // com/bryzek/apidoc/api/v0/models/AttributeValue
    const target = find(service.models, { shortName: 'attribute_value' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'AttributeValue',
      moduleName: './AttributeValue',
    });
  });

  test('should return import statement relative to modules in the same API builder "namespace"', () => {
    // com/bryzek/apidoc/api/v0/models/Original
    const source = find(service.models, { shortName: 'original' });
    // com/bryzek/apidoc/api/v0/enums/OriginalType
    const target = find(service.enums, { shortName: 'original_type' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'OriginalType',
      moduleName: '../enums/OriginalType',
    });
  });

  test('should return import statement relative to modules in a different API builder namespace', () => {
    // com/bryzek/apidoc/api/v0/models/Subscription
    const source = find(service.models, { baseType: 'com.bryzek.apidoc.api.v0.models.subscription' });
    // com/bryzek/apidoc/common/v0/models/Audit
    const target = find(service.models, { baseType: 'com.bryzek.apidoc.common.v0.models.audit' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'Audit',
      moduleName: '../../../common/v0/models/Audit',
    });
  });
});
