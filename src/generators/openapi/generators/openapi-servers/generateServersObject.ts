
import { ServerObject } from '@loopback/openapi-v3-types';

function generateServersObject(): ServerObject[] {
  return [
    {
      url: 'https://api.flow.io',
    },
  ];
}

export default generateServersObject;
