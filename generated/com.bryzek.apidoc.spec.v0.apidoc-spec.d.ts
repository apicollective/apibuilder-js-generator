declare namespace com.bryzek.apidoc.spec.v0.enums {
  type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE';
  type ParameterLocation = 'Path' | 'Query' | 'Form' | 'Header';
  type ResponseCodeOption = 'Default';
}

declare namespace com.bryzek.apidoc.spec.v0.models {
  interface Apidoc {
    readonly 'version': string;
  }

  interface Application {
    readonly 'key': string;
  }

  interface Attribute {
    readonly 'name': string;
    readonly 'value': any/* object */;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
  }

  interface Body {
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Contact {
    readonly 'name'?: string;
    readonly 'url'?: string;
    readonly 'email'?: string;
  }

  interface Deprecation {
    readonly 'description'?: string;
  }

  interface Enum {
    readonly 'name': string;
    readonly 'plural': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'values': com.bryzek.apidoc.spec.v0.models.EnumValue[];
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface EnumValue {
    readonly 'name': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Field {
    readonly 'name': string;
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'default'?: string;
    readonly 'required': boolean;
    readonly 'minimum'?: number;
    readonly 'maximum'?: number;
    readonly 'example'?: string;
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Header {
    readonly 'name': string;
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'required': boolean;
    readonly 'default'?: string;
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Import {
    readonly 'uri': string;
    readonly 'namespace': string;
    readonly 'organization': com.bryzek.apidoc.spec.v0.models.Organization;
    readonly 'application': com.bryzek.apidoc.spec.v0.models.Application;
    readonly 'version': string;
    readonly 'enums': string[];
    readonly 'unions': string[];
    readonly 'models': string[];
  }

  interface Info {
    readonly 'license'?: com.bryzek.apidoc.spec.v0.models.License;
    readonly 'contact'?: com.bryzek.apidoc.spec.v0.models.Contact;
  }

  interface License {
    readonly 'name': string;
    readonly 'url'?: string;
  }

  interface Model {
    readonly 'name': string;
    readonly 'plural': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'fields': com.bryzek.apidoc.spec.v0.models.Field[];
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Operation {
    readonly 'method': com.bryzek.apidoc.spec.v0.enums.Method;
    readonly 'path': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'body'?: com.bryzek.apidoc.spec.v0.models.Body;
    readonly 'parameters': com.bryzek.apidoc.spec.v0.models.Parameter[];
    readonly 'responses': com.bryzek.apidoc.spec.v0.models.Response[];
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Organization {
    readonly 'key': string;
  }

  interface Parameter {
    readonly 'name': string;
    readonly 'type': string;
    readonly 'location': com.bryzek.apidoc.spec.v0.enums.ParameterLocation;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'required': boolean;
    readonly 'default'?: string;
    readonly 'minimum'?: number;
    readonly 'maximum'?: number;
    readonly 'example'?: string;
  }

  interface Resource {
    readonly 'type': string;
    readonly 'plural': string;
    readonly 'path'?: string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'operations': com.bryzek.apidoc.spec.v0.models.Operation[];
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Response {
    readonly 'code': com.bryzek.apidoc.spec.v0.unions.ResponseCode;
    readonly 'type': string;
    readonly 'headers'?: com.bryzek.apidoc.spec.v0.models.Header[];
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
  }

  interface Service {
    readonly 'apidoc': com.bryzek.apidoc.spec.v0.models.Apidoc;
    readonly 'name': string;
    readonly 'organization': com.bryzek.apidoc.spec.v0.models.Organization;
    readonly 'application': com.bryzek.apidoc.spec.v0.models.Application;
    readonly 'namespace': string;
    readonly 'version': string;
    readonly 'base_url'?: string;
    readonly 'description'?: string;
    readonly 'info': com.bryzek.apidoc.spec.v0.models.Info;
    readonly 'headers': com.bryzek.apidoc.spec.v0.models.Header[];
    readonly 'imports': com.bryzek.apidoc.spec.v0.models.Import[];
    readonly 'enums': com.bryzek.apidoc.spec.v0.models.Enum[];
    readonly 'unions': com.bryzek.apidoc.spec.v0.models.Union[];
    readonly 'models': com.bryzek.apidoc.spec.v0.models.Model[];
    readonly 'resources': com.bryzek.apidoc.spec.v0.models.Resource[];
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface Union {
    readonly 'name': string;
    readonly 'plural': string;
    readonly 'discriminator'?: string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'types': com.bryzek.apidoc.spec.v0.models.UnionType[];
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
  }

  interface UnionType {
    readonly 'type': string;
    readonly 'description'?: string;
    readonly 'deprecation'?: com.bryzek.apidoc.spec.v0.models.Deprecation;
    readonly 'attributes': com.bryzek.apidoc.spec.v0.models.Attribute[];
    readonly 'default'?: boolean;
  }
}

declare namespace com.bryzek.apidoc.spec.v0.unions {
  type ResponseCode = ({
    discriminator: 'integer',
    value: number
  } | {
    discriminator: 'response_code_option',
    value: com.bryzek.apidoc.spec.v0.enums.ResponseCodeOption
  });
}
