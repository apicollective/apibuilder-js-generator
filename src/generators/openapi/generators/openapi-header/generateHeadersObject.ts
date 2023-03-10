import { HeaderObject } from '@loopback/openapi-v3-types';
import { ApiBuilderHeaderConfig } from 'apibuilder-js';
import { reduce } from 'lodash';

function generateHeadersObject(headers: ReadonlyArray<ApiBuilderHeaderConfig>): HeaderObject {
  return reduce(
    headers,
    (acc, value) => {
      const {
        description: apibuilderHeaderDescription,
        deprecation,
        required,
        type,
      } = value;

      // tslint-ignore-next-line
      const description = `Header generated from Apibuilder\
      spec of type ${type}. ${apibuilderHeaderDescription}`;

      acc[value.name] = {
        deprecation,
        description,
        required,
      };
      return acc;
    },
    {},
  );
}

export default generateHeadersObject;
