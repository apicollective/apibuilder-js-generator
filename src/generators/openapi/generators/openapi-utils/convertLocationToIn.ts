import { ParameterLocation } from '@loopback/openapi-v3-types';
import { ApiBuilderParameterLocation } from 'apibuilder-js';

function convertLocationToIn(location: ApiBuilderParameterLocation): ParameterLocation {
  switch (location) {
    case 'Path': return 'path';
    case 'Query': return 'query';
    case 'Header': return 'header';
    case 'Form': return 'header';
  }
}

export default convertLocationToIn;
