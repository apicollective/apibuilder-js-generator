import Service from '../../../../utilities/apibuilder/Service';

import generateEnumPropTypeFile from '../generate-enum-prop-type-file';
import loadFixture from '../../../../../test/utilities/load-fixture';

describe('generateEnumPropTypeFile', () => {
  const apiDefinition = {
    service: {
      organization: { key: 'test-organization' },
      application: { key: 'test-application' },
      namespace: 'io.flow.test.v0',
    },
  };

  const service = new Service(apiDefinition);

  it('should return a GenerateFile containing the path and file contents for the prop type', () => {
    const entity = {
      id: 'io.flow.test.v0.enum_1',
      name: 'enum_1',
      type: 'enum',
      entity: {
        name: 'enum_1',
        values: [
          { name: 'enum_1_value_1' },
          { name: 'enum_1_value_2' },
        ],
      },
    };

    const generatedFile = generateEnumPropTypeFile(entity, service);

    expect(generatedFile.path).toEqual('enum/enum-1.js');
    expect(generatedFile.contents).toEqual(loadFixture(__dirname, './fixtures/enum-prop-type-file.js.fixture'));
  });
});
