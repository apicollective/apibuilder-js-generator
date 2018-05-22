const find = require('lodash/find');
const Service = require('../../../../../src/utilities/apibuilder/Service');
const schema = require('../../../../fixtures/schemas/apidoc-api.json');
const toImportStatement = require('../../../../../src/generators/prop_types/utilities/toImportStatement');

const service = new Service({ service: schema });

describe('toImportStatement', () => {
  test('should return import statement relative from one entity to another', () => {
    // com/bryzek/apidoc/api/v0/models/attributeValueFormPropTypes
    const source = find(service.models, { shortName: 'attribute_value_form' });
    // com/bryzek/apidoc/common/v0/models/healthcheckPropTypes
    const target = find(service.models, { shortName: 'healthcheck' });
    expect(toImportStatement(source, target)).toEqual({
      defaultExport: 'healthcheckPropTypes',
      moduleName: '../../../../common/v0/models/healthcheckPropTypes',
    });
  });
});
