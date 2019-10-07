
import { ServerObject } from '@loopback/openapi-v3-types';

function generateServersObject(service): ServerObject[] {
  return [
    {
      url: service.baseUrl,
    },
  ];
}

export default generateServersObject;
