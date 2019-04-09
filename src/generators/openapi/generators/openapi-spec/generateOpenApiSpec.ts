import {
  OpenAPIObject,
} from '@loopback/openapi-v3-types';
import {
  ApiBuilderService,
} from 'apibuilder-js';
import { generateComponentsObject } from '../openapi-components';
import { generateInfoObject } from '../openapi-info';
import { generatePathsObject } from '../openapi-paths';

const generateOpenApiSpec = (service: ApiBuilderService): OpenAPIObject => {
  const openapi = '3.0.2';
  const info = generateInfoObject(service);
  const paths = generatePathsObject(service);
  const components = generateComponentsObject(service);
  return {
    components,
    info,
    openapi,
    paths,
  };
};

export default generateOpenApiSpec;
