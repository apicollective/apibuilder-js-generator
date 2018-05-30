const find = require('lodash/find');
const ApiBuilderService = require('../../../../../src/utilities/apibuilder/ApiBuilderService');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toImportStatement = require('../../../../../src/generators/prop_types/utilities/toImportStatement');

const service = new ApiBuilderService({ service: schema });

describe('toImportStatement', () => {
  test('should return import statement relative modules in the same "package"', () => {
    // com/bryzek/apidoc/api/v0/models/attributeValueFormPropTypes
    const source = find(service.models, { shortName: 'attribute_value_form' });
    // com/bryzek/apidoc/api/v0/models/attributeValuePropTypes
    const target = find(service.models, { shortName: 'attribute_value' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'attributeValuePropTypes',
      moduleName: './attributeValuePropTypes',
    });
  });

  test('should return import statement relative to modules in the same API builder "namespace"', () => {
    // com/bryzek/apidoc/api/v0/models/originalPropTypes
    const source = find(service.models, { shortName: 'original' });
    // com/bryzek/apidoc/api/v0/enums/originalTypePropTypes
    const target = find(service.enums, { shortName: 'original_type' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'originalTypePropTypes',
      moduleName: '../enums/originalTypePropTypes',
    });
  });

  test('should return import statement relative to modules in a different API builder namespace', () => {
    // com/bryzek/apidoc/api/v0/models/subscriptionPropTypes
    const source = find(service.models, { baseType: 'com.bryzek.apidoc.api.v0.models.subscription' });
    // com/bryzek/apidoc/common/v0/models/auditPropTypes
    const target = find(service.models, { baseType: 'com.bryzek.apidoc.common.v0.models.audit' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'auditPropTypes',
      moduleName: '../../../common/v0/models/auditPropTypes',
    });
  });
});
