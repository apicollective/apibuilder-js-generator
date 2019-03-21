import { ParameterLocation } from '@loopback/openapi-v3-types';
import { ApiBuilderParameterLocation } from 'apibuilder-js';

function convertLocationToIn(location: ApiBuilderParameterLocation): ParameterLocation {
  switch (location) {
    case ApiBuilderParameterLocation.Path: return 'path';
    case ApiBuilderParameterLocation.Query: return 'query';
    case ApiBuilderParameterLocation.Header: return 'header';
    case ApiBuilderParameterLocation.Form: return 'header';
  }
}

export default convertLocationToIn;
