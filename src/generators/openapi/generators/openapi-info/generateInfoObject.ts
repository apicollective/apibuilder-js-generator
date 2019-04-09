import { InfoObject } from '@loopback/openapi-v3-types';
import { get } from 'lodash';

function generateInfoObject(service): InfoObject {
  return {
    contact: get(service, 'info.contact', {}),
    description: service.description,
    license: get(service, 'info.license', {}),
    termsOfService: '',
    title: service.name,
    version: service.version,
  };
}

export default generateInfoObject;
