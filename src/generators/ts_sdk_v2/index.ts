import {
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderOperation,
  ApiBuilderPrimitiveType,
  ApiBuilderResource,
  ApiBuilderType,
  isArrayType,
  isMapType,
  isPrimitiveType,
  Kind,
} from 'apibuilder-js';
import { builders as b, namedTypes } from 'ast-types';
import { DeclarationKind, PatternKind, StatementKind, TSTypeKind } from 'ast-types/gen/kinds';
import debug from 'debug';
import { camelCase, flatMap } from 'lodash';
import { print } from 'recast';
import url from 'url';

import {
  buildContext,
  buildType,
  buildTypeAnnotation,
  buildTypeQualifiedName,
  Context,
} from '../../builders';
import pascalCase from '../../utilities/pascalCase';
import stringCompare from '../../utilities/stringCompare';
import stripTrailingSlash from '../../utilities/stripTrailingSlash';

type TSTypeDeclaration = namedTypes.TSInterfaceDeclaration | namedTypes.TSTypeAliasDeclaration;

const log = debug('apibuilder:ts_service');

const httpStatusCodes: Record<number, string> = {
  100: 'Continue',
  101: 'Switching Protocol',
  102: 'Processing',
  200: 'Ok',
  201: 'Created',
  202: 'Accepted',
  203: 'Non Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Request Entity Too Large',
  414: 'Request URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Requested Range Not Satisfiable',
  417: 'Expectation Failed',
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  444: 'No Response',
  449: 'Retry With',
  450: 'Blocked by Windows Parental Controls',
  451: 'Unavailable For Legal Reasons',
  499: 'Client Closed Request',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  509: 'Bandwidth Limit Exceeded',
  510: 'Not Extended',
  511: 'Network Authentication Required',
  598: 'Network Read Timeout Error',
  599: 'Network Connect Timeout Error',
};

const IDENTIFIER_FETCH_FUNCTION = '$FetchFunction';
const IDENTIFIER_FETCH_OPTIONS = '$FetchOptions';
const IDENTIFIER_HTTP_CLIENT = '$HttpClient';
const IDENTIFIER_HTTP_CLIENT_OPTIONS = '$HttpClientOptions';
const IDENTIFIER_HTTP_HEADERS = '$HttpHeaders';
const IDENTIFIER_HTTP_METHOD = '$HttpMethod';
const IDENTIFIER_HTTP_QUERY = '$HttpQuery';
const IDENTIFIER_HTTP_REQUEST = '$HttpRequest';
const IDENTIFIER_HTTP_REQUEST_OPTIONS = '$HttpRequestOptions';
const IDENTIFIER_HTTP_RESPONSE_ERROR = '$HttpResponseError';
const IDENTIFIER_HTTP_RESPONSE = '$HttpResponse';
const IDENTIFIER_STRIP_QUERY = 'stripQuery';
const IDENTIFIER_RESOURCE_CLASS = '$Resource';

// Name for namespace containing internal types.
// Used to avoid naming collision with types generated
// from API builder specifications.
const IDENTIFIER_INTERNAL_NAMESPACE = 'internalTypes';

function isOk(statusCode: number | string) {
  const status = typeof statusCode === 'string' ? parseInt(statusCode, 10) : statusCode;
  return status >= 200 && status < 300;
}

function buildExportNamedDeclaration(
  declaration: DeclarationKind,
): namedTypes.ExportNamedDeclaration {
  return b.exportNamedDeclaration.from({
    declaration,
  });
}

function buildInternalTypeIdentifier(
  name: string,
): namedTypes.TSQualifiedName {
  return b.tsQualifiedName.from({
    left: b.identifier(IDENTIFIER_INTERNAL_NAMESPACE),
    right: b.identifier(name),
  });
}

function buildHttpResponseCodeIdentifier(statusCode: number | string) {
  const statusText = httpStatusCodes[statusCode];
  const name = statusText != null ? pascalCase(statusText) : statusCode;
  return b.identifier(`$Http${name}`);
}

function buildPrimitiveTypeReference(
  type: ApiBuilderPrimitiveType,
) {
  switch (type.shortName) {
    case Kind.STRING:
    case Kind.DATE_ISO8601:
    case Kind.DATE_TIME_ISO8601:
    case Kind.UUID:
    case Kind.JSON:
      return b.tsStringKeyword();
    case Kind.BOOLEAN:
      return b.tsBooleanKeyword();
    case Kind.DECIMAL:
    case Kind.DOUBLE:
    case Kind.INTEGER:
    case Kind.LONG:
      return b.tsNumberKeyword();
    case Kind.UNIT:
      return b.tsUndefinedKeyword();
    case Kind.OBJECT:
    default:
      return b.tsAnyKeyword();
  }
}

function buildFetchOptions(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier('body'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('headers'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_HEADERS),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('method'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_METHOD),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: IDENTIFIER_FETCH_OPTIONS,
    }),
  });
}

function buildFetchFunction(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier(IDENTIFIER_FETCH_FUNCTION),
    typeAnnotation: b.tsFunctionType.from({
      parameters: [
        b.identifier.from({
          name: 'url',
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
        b.identifier.from({
          name: 'options',
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_FETCH_OPTIONS),
            }),
          }),
        }),
      ],
      typeAnnotation: b.tsTypeAnnotation.from({
        typeAnnotation: b.tsTypeReference.from({
          typeName: b.identifier('Promise'),
          typeParameters: b.tsTypeParameterInstantiation.from({
            params: [
              b.tsTypeReference.from({
                typeName: b.identifier('Response'),
              }),
            ],
          }),
        }),
      }),
    }),

  });
}

function buildHttpMethod(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier.from({
      name: IDENTIFIER_HTTP_METHOD,
    }),
    typeAnnotation: b.tsUnionType.from({
      types: [
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'GET',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'POST',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'PUT',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'PATCH',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'DELETE',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'HEAD',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'CONNECT',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'OPTIONS',
          }),
        }),
        b.tsLiteralType.from({
          literal: b.stringLiteral.from({
            value: 'TRACE',
          }),
        }),
      ],
    }),
  });
}

function buildHttpHeaders(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsIndexSignature.from({
          parameters: [
            b.identifier.from({
              name: 'key',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsStringKeyword(),
              }),
            }),
          ],
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_HTTP_HEADERS),
  });
}

function buildHttpQuery(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsIndexSignature.from({
          parameters: [
            b.identifier.from({
              name: 'key',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsStringKeyword(),
              }),
            }),
          ],
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsUnionType.from({
              types: [
                b.tsStringKeyword(),
                b.tsNumberKeyword(),
                b.tsBooleanKeyword(),
                b.tsArrayType.from({
                  elementType: b.tsStringKeyword(),
                }),
                b.tsArrayType.from({
                  elementType: b.tsNumberKeyword(),
                }),
                b.tsArrayType.from({
                  elementType: b.tsBooleanKeyword(),
                }),
                b.tsUndefinedKeyword(),
                b.tsNullKeyword(),
              ],
            }),
          }),
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_HTTP_QUERY),
  });
}

function buildHttpRequest(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'body',
          }),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            // TODO: Use JSONValue when this issue is fixed:
            // https://github.com/microsoft/TypeScript/issues/15300
            typeAnnotation: b.tsAnyKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'url',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'headers',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_HEADERS),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'method',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_METHOD),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: IDENTIFIER_HTTP_REQUEST,
    }),
  });
}

function buildHttpRequestOptions(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'body',
          }),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            // TODO: Use JSONValue when this issue is fixed:
            // https://github.com/microsoft/TypeScript/issues/15300
            typeAnnotation: b.tsAnyKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'endpoint',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'headers',
          }),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_HEADERS),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'method',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_METHOD),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('query'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_QUERY),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_HTTP_REQUEST_OPTIONS),
  });
}

function buildHttpResponse(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier('body'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('B'),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'headers',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_HEADERS),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('ok'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('O'),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'request',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_REQUEST),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('status'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('S'),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('statusText'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: IDENTIFIER_HTTP_RESPONSE,
    }),
    typeParameters: b.tsTypeParameterDeclaration.from({
      params: [
        b.tsTypeParameter.from({
          default: b.tsAnyKeyword(),
          name: 'B',
        }),
        b.tsTypeParameter.from({
          default: b.tsNumberKeyword(),
          name: 'S',
        }),
        b.tsTypeParameter.from({
          default: b.tsBooleanKeyword(),
          name: 'O',
        }),
      ],
    }),
  });
}

function buildHttpClientOptions(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier('fetch'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_FETCH_FUNCTION),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_HTTP_CLIENT_OPTIONS),
  });
}

function buildHttpClientClass(
  context: Context,
): namedTypes.ClassDeclaration {
  const {
    pathname,
    protocol,
    hostname,
  } = url.parse(context.rootService.baseUrl);

  const basePathName = stripTrailingSlash(pathname);

  return b.classDeclaration.from({
    body: b.classBody.from({
      body: [
        b.classProperty.from({
          access: 'private',
          key: b.identifier('options'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_CLIENT_OPTIONS),
            }),
          }),
          value: null,
        }),
        b.classMethod.from({
          body: b.blockStatement.from({
            body: [
              b.expressionStatement.from({
                expression: b.assignmentExpression.from({
                  left: b.memberExpression.from({
                    object: b.thisExpression(),
                    property: b.identifier('options'),
                  }),
                  operator: '=',
                  right: b.identifier('options'),
                }),
              }),
            ],
          }),
          key: b.identifier('constructor'),
          kind: 'constructor',
          params: [
            b.identifier.from({
              name: 'options',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsTypeReference.from({
                  typeName: b.identifier(IDENTIFIER_HTTP_CLIENT_OPTIONS),
                }),
              }),
            }),
          ],
        }),
        b.classMethod.from({
          access: 'public',
          body: b.blockStatement.from({
            body: [
              b.variableDeclaration.from({
                declarations: [
                  b.variableDeclarator.from({
                    id: b.identifier.from({
                      name: 'finalUrl',
                      typeAnnotation: b.tsTypeAnnotation.from({
                        typeAnnotation: b.tsStringKeyword(),
                      }),
                    }),
                    init: b.callExpression.from({
                      arguments: [
                        b.objectExpression.from({
                          properties: [
                            b.property.from({
                              key: b.identifier('hostname'),
                              kind: 'init',
                              value: b.stringLiteral(hostname),
                            }),
                            b.property.from({
                              key: b.identifier('pathname'),
                              kind: 'init',
                              value: !basePathName.length ? b.memberExpression.from({
                                object: b.identifier('options'),
                                property: b.identifier('endpoint'),
                              }) : b.binaryExpression.from({
                                left: b.stringLiteral(basePathName),
                                operator: '+',
                                right: b.memberExpression.from({
                                  object: b.identifier('options'),
                                  property: b.identifier('endpoint'),
                                }),
                              }),
                            }),
                            b.property.from({
                              key: b.identifier('protocol'),
                              kind: 'init',
                              value: b.stringLiteral(protocol),
                            }),
                            b.property.from({
                              key: b.identifier('query'),
                              kind: 'init',
                              value: b.callExpression.from({
                                arguments: [
                                  b.memberExpression.from({
                                    object: b.identifier('options'),
                                    property: b.identifier('query'),
                                  }),
                                ],
                                callee: b.identifier.from({
                                  name: IDENTIFIER_STRIP_QUERY,
                                }),
                              }),
                            }),
                          ],
                        }),
                      ],
                      callee: b.memberExpression.from({
                        object: b.identifier('url'),
                        property: b.identifier('format'),
                      }),
                    }),
                  }),
                ],
                kind: 'const',
              }),
              b.variableDeclaration.from({
                declarations: [
                  b.variableDeclarator.from({
                    id: b.identifier.from({
                      name: 'finalHeaders',
                      typeAnnotation: b.tsTypeAnnotation.from({
                        typeAnnotation: b.tsTypeReference.from({
                          typeName: b.identifier(IDENTIFIER_HTTP_HEADERS),
                        }),
                      }),
                    }),
                    init: b.objectExpression.from({
                      properties: [
                        b.property.from({
                          key: b.identifier('accept'),
                          kind: 'init',
                          value: b.stringLiteral('application/json'),
                        }),
                        b.property.from({
                          key: b.stringLiteral('content-type'),
                          kind: 'init',
                          value: b.stringLiteral('application/json'),
                        }),
                        b.spreadProperty.from({
                          argument: b.memberExpression.from({
                            object: b.identifier('options'),
                            property: b.identifier('headers'),
                          }),
                        }),
                      ],
                    }),
                  }),
                ],
                kind: 'const',
              }),
              b.variableDeclaration.from({
                declarations: [
                  b.variableDeclarator.from({
                    id: b.identifier.from({
                      name: 'request',
                      typeAnnotation: b.tsTypeAnnotation.from({
                        typeAnnotation: b.tsTypeReference.from({
                          typeName: b.identifier(IDENTIFIER_HTTP_REQUEST),
                        }),
                      }),
                    }),
                    init: b.objectExpression.from({
                      properties: [
                        b.property.from({
                          key: b.identifier('body'),
                          kind: 'init',
                          value: b.memberExpression.from({
                            object: b.identifier('options'),
                            property: b.identifier('body'),
                          }),
                        }),
                        b.property.from({
                          key: b.identifier('headers'),
                          kind: 'init',
                          value: b.identifier('finalHeaders'),
                        }),
                        b.property.from({
                          key: b.identifier('method'),
                          kind: 'init',
                          value: b.memberExpression.from({
                            object: b.identifier('options'),
                            property: b.identifier('method'),
                          }),
                        }),
                        b.property.from({
                          key: b.identifier('url'),
                          kind: 'init',
                          value: b.identifier('finalUrl'),
                        }),
                      ],
                    }),
                  }),
                ],
                kind: 'const',
              }),
              b.returnStatement.from({
                argument: b.callExpression.from({
                  arguments: [
                    b.arrowFunctionExpression.from({
                      body: b.blockStatement.from({
                        body: [
                          b.returnStatement.from({
                            argument: b.callExpression.from({
                              arguments: [
                                b.arrowFunctionExpression.from({
                                  body: b.blockStatement.from({
                                    body: [
                                      b.returnStatement.from({
                                        argument: b.objectExpression.from({
                                          properties: [
                                            b.objectProperty.from({
                                              key: b.identifier('body'),
                                              value: b.identifier('json'),
                                            }),
                                            b.objectProperty.from({
                                              key: b.identifier('headers'),
                                              value: b.callExpression.from({
                                                arguments: [
                                                  b.identifier('response'),
                                                ],
                                                callee: b.identifier('parseHeaders'),
                                              }),
                                            }),
                                            b.objectProperty.from({
                                              key: b.identifier('ok'),
                                              value: b.memberExpression.from({
                                                object: b.identifier('response'),
                                                property: b.identifier('ok'),
                                              }),
                                            }),
                                            b.objectProperty.from({
                                              key: b.identifier('request'),
                                              shorthand: true,
                                              value: b.identifier('request'),
                                            }),
                                            b.objectProperty.from({
                                              key: b.identifier('status'),
                                              value: b.memberExpression.from({
                                                object: b.identifier('response'),
                                                property: b.identifier('status'),
                                              }),
                                            }),
                                            b.objectProperty.from({
                                              key: b.identifier('statusText'),
                                              value: b.memberExpression.from({
                                                object: b.identifier('response'),
                                                property: b.identifier('statusText'),
                                              }),
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  }),
                                  params: [
                                    b.identifier('json'),
                                  ],
                                }),
                              ],
                              callee: b.memberExpression.from({
                                object: b.callExpression.from({
                                  arguments: [
                                    b.identifier('response'),
                                  ],
                                  callee: b.identifier('parseJson'),
                                }),
                                property: b.identifier('then'),
                              }),
                            }),
                          }),
                        ],
                      }),
                      params: [
                        b.identifier('response'),
                      ],
                    }),
                  ],
                  callee: b.memberExpression.from({
                    object: b.callExpression.from({
                      arguments: [
                        b.memberExpression.from({
                          object: b.identifier('request'),
                          property: b.identifier('url'),
                        }),
                        b.objectExpression.from({
                          properties: [
                            b.objectProperty.from({
                              key: b.identifier('body'),
                              value: b.callExpression.from({
                                arguments: [
                                  b.memberExpression.from({
                                    object: b.identifier('request'),
                                    property: b.identifier('body'),
                                  }),
                                ],
                                callee: b.memberExpression.from({
                                  object: b.identifier('JSON'),
                                  property: b.identifier('stringify'),
                                }),
                              }),
                            }),
                            b.objectProperty.from({
                              key: b.identifier('headers'),
                              value: b.memberExpression.from({
                                object: b.identifier('request'),
                                property: b.identifier('headers'),
                              }),
                            }),
                            b.objectProperty.from({
                              key: b.identifier('method'),
                              value: b.memberExpression.from({
                                object: b.identifier('request'),
                                property: b.identifier('method'),
                              }),
                            }),
                          ],
                        }),
                      ],
                      callee: b.memberExpression.from({
                        object: b.memberExpression.from({
                          object: b.thisExpression(),
                          property: b.identifier('options'),
                        }),
                        property: b.identifier('fetch'),
                      }),
                    }),
                    property: b.identifier('then'),
                  }),
                }),
              }),
            ],
          }),
          key: b.identifier('request'),
          kind: 'method',
          params: [
            b.identifier.from({
              name: 'options',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsTypeReference.from({
                  typeName: b.identifier(IDENTIFIER_HTTP_REQUEST_OPTIONS),
                }),
              }),
            }),
          ],
          returnType: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('Promise'),
              typeParameters: b.tsTypeParameterInstantiation.from({
                params: [
                  b.tsTypeReference.from({
                    typeName: b.identifier(
                      IDENTIFIER_HTTP_RESPONSE,
                    ),
                    typeParameters: b.tsTypeParameterInstantiation.from({
                      params: [
                        b.tsAnyKeyword(),
                        b.tsAnyKeyword(),
                        b.tsAnyKeyword(),
                      ],
                    }),
                  }),
                ],
              }),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_HTTP_CLIENT),
  });
}

function buildBaseErrorClass(): namedTypes.ClassDeclaration {
  return b.classDeclaration.from({
    body: b.classBody.from({
      body: [
        b.methodDefinition.from({
          key: b.identifier('constructor'),
          kind: 'constructor',
          value: b.functionExpression.from({
            body: b.blockStatement.from({
              body: [
                b.expressionStatement.from({
                  expression: b.callExpression.from({
                    arguments: [
                      b.identifier('message'),
                    ],
                    callee: b.super(),
                  }),
                }),
                b.expressionStatement.from({
                  expression: b.assignmentExpression.from({
                    left: b.memberExpression.from({
                      object: b.thisExpression(),
                      property: b.identifier('name'),
                    }),
                    operator: '=',
                    right: b.memberExpression.from({
                      object: b.memberExpression.from({
                        object: b.thisExpression(),
                        property: b.identifier('constructor'),
                      }),
                      property: b.identifier('name'),
                    }),
                  }),
                }),
                b.ifStatement.from({
                  consequent: b.blockStatement.from({
                    body: [
                      b.expressionStatement.from({
                        expression: b.callExpression.from({
                          arguments: [
                            b.thisExpression(),
                            b.memberExpression.from({
                              object: b.thisExpression(),
                              property: b.identifier('constructor'),
                            }),
                          ],
                          callee: b.memberExpression.from({
                            object: b.identifier('Error'),
                            property: b.identifier('captureStackTrace'),
                          }),
                        }),
                      }),
                    ],
                  }),
                  test: b.callExpression.from({
                    arguments: [
                      b.stringLiteral('captureStackTrace'),
                    ],
                    callee: b.memberExpression.from({
                      object: b.identifier('Error'),
                      property: b.identifier('hasOwnProperty'),
                    }),
                  }),
                }),
              ],
            }),
            params: [
              b.identifier.from({
                name: 'message',
                optional: true,
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsStringKeyword(),
                }),
              }),
            ],
          }),
        }),
      ],
    }),
    id: b.identifier('BaseError'),
    superClass: b.identifier('Error'),
  });
}

function buildIsResponseEmptyFunction(): namedTypes.FunctionDeclaration {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.variableDeclaration.from({
          declarations: [
            b.variableDeclarator.from({
              id: b.identifier.from({
                name: 'contentLength',
              }),
              init: b.callExpression.from({
                arguments: [
                  b.stringLiteral.from({
                    value: 'Content-Length',
                  }),
                ],
                callee: b.memberExpression.from({
                  object: b.memberExpression.from({
                    object: b.identifier.from({
                      name: 'response',
                    }),
                    property: b.identifier.from({
                      name: 'headers',
                    }),
                  }),
                  property: b.identifier.from({
                    name: 'get',
                  }),
                }),
              }),
            }),
          ],
          kind: 'const',
        }),
        b.returnStatement.from({
          argument: b.logicalExpression.from({
            left: b.binaryExpression.from({
              left: b.identifier.from({
                name: 'contentLength',
              }),
              operator: '!=',
              right: b.nullLiteral(),
            }),
            operator: '&&',
            right: b.binaryExpression.from({
              left: b.callExpression.from({
                arguments: [
                  b.identifier.from({
                    name: 'contentLength',
                  }),
                  b.numericLiteral.from({
                    value: 10,
                  }),
                ],
                callee: b.memberExpression.from({
                  object: b.identifier.from({
                    name: 'Number',
                  }),
                  property: b.identifier.from({
                    name: 'parseInt',
                  }),
                }),
              }),
              operator: '===',
              right: b.numericLiteral.from({
                value: 0,
              }),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: 'isResponseEmpty',
    }),
    params: [
      b.identifier.from({
        name: 'response',
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier.from({
              name: 'Response',
            }),
          }),
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsBooleanKeyword(),
    }),
  });
}

function buildIsResponseJsonFunction(): namedTypes.FunctionDeclaration {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.variableDeclaration.from({
          declarations: [
            b.variableDeclarator.from({
              id: b.identifier.from({
                name: 'contentType',
              }),
              init: b.callExpression.from({
                arguments: [
                  b.stringLiteral.from({
                    value: 'Content-Type',
                  }),
                ],
                callee: b.memberExpression.from({
                  object: b.memberExpression.from({
                    object: b.identifier.from({
                      name: 'response',
                    }),
                    property: b.identifier.from({
                      name: 'headers',
                    }),
                  }),
                  property: b.identifier.from({
                    name: 'get',
                  }),
                }),
              }),
            }),
          ],
          kind: 'const',
        }),
        b.returnStatement.from({
          argument: b.logicalExpression.from({
            left: b.binaryExpression.from({
              left: b.identifier.from({
                name: 'contentType',
              }),
              operator: '!=',
              right: b.nullLiteral(),
            }),
            operator: '&&',
            right: b.binaryExpression.from({
              left: b.callExpression.from({
                arguments: [
                  b.stringLiteral.from({
                    value: 'json',
                  }),
                ],
                callee: b.memberExpression.from({
                  object: b.identifier.from({
                    name: 'contentType',
                  }),
                  property: b.identifier.from({
                    name: 'indexOf',
                  }),
                }),
              }),
              operator: '>=',
              right: b.numericLiteral.from({
                value: 0,
              }),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: 'isResponseJson',
    }),
    params: [
      b.identifier.from({
        name: 'response',
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier.from({
              name: 'Response',
            }),
          }),
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsBooleanKeyword(),
    }),
  });
}

function buildParseJsonFunction(): namedTypes.FunctionDeclaration {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.returnStatement.from({
          argument: b.conditionalExpression.from({
            alternate: b.callExpression.from({
              arguments: [],
              callee: b.memberExpression.from({
                object: b.identifier.from({
                  name: 'Promise',
                }),
                property: b.identifier.from({
                  name: 'resolve',
                }),
              }),
            }),
            consequent: b.callExpression.from({
              arguments: [],
              callee: b.memberExpression.from({
                object: b.identifier.from({
                  name: 'response',
                }),
                property: b.identifier.from({
                  name: 'json',
                }),
              }),
            }),
            test: b.logicalExpression.from({
              left: b.unaryExpression.from({
                argument: b.callExpression.from({
                  arguments: [
                    b.identifier.from({
                      name: 'response',
                    }),
                  ],
                  callee: b.identifier.from({
                    name: 'isResponseEmpty',
                  }),
                }),
                operator: '!',
                prefix: true,
              }),
              operator: '&&',
              right: b.callExpression.from({
                arguments: [
                  b.identifier.from({
                    name: 'response',
                  }),
                ],
                callee: b.identifier.from({
                  name: 'isResponseJson',
                }),
              }),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: 'parseJson',
    }),
    params: [
      b.identifier.from({
        name: 'response',
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier.from({
              name: 'Response',
            }),
          }),
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier.from({
          name: 'Promise',
        }),
        typeParameters: b.tsTypeParameterInstantiation.from({
          params: [
            b.tsTypeReference.from({
              typeName: b.identifier.from({
                // name: 'JSONValue',
                name: 'any',
              }),
            }),
          ],
        }),
      }),
    }),
  });
}

function buildParseHeadersFunction(): namedTypes.FunctionDeclaration {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.variableDeclaration.from({
          declarations: [
            b.variableDeclarator.from({
              id: b.identifier.from({
                name: 'headers',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier('Record'),
                    typeParameters: b.tsTypeParameterInstantiation.from({
                      params: [
                        b.tsStringKeyword(),
                        b.tsStringKeyword(),
                      ],
                    }),
                  }),
                }),
              }),
              init: b.objectExpression.from({
                properties: [],
              }),
            }),
          ],
          kind: 'const',
        }),
        b.expressionStatement.from({
          expression: b.callExpression.from({
            arguments: [
              b.arrowFunctionExpression.from({
                body: b.blockStatement.from({
                  body: [
                    b.expressionStatement.from({
                      expression: b.assignmentExpression.from({
                        left: b.memberExpression.from({
                          computed: true,
                          object: b.identifier('headers'),
                          property: b.callExpression.from({
                            arguments: [],
                            callee: b.memberExpression.from({
                              object: b.identifier('key'),
                              property: b.identifier('toLowerCase'),
                            }),
                          }),
                        }),
                        operator: '=',
                        right: b.identifier('value'),
                      }),
                    }),
                  ],
                }),
                params: [
                  b.identifier('value'),
                  b.identifier('key'),
                ],
              }),
            ],
            callee: b.memberExpression.from({
              object: b.memberExpression.from({
                object: b.identifier('response'),
                property: b.identifier('headers'),
              }),
              property: b.identifier('forEach'),
            }),
          }),
        }),
        b.returnStatement.from({
          argument: b.identifier('headers'),
        }),
      ],
    }),
    id: b.identifier('parseHeaders'),
    params: [
      b.identifier.from({
        name: 'response',
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier('Response'),
          }),
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier('Record'),
        typeParameters: b.tsTypeParameterInstantiation.from({
          params: [
            b.tsStringKeyword(),
            b.tsStringKeyword(),
          ],
        }),
      }),
    }),
  });
}

function buildBaseResourceClass(): namedTypes.ClassDeclaration {
  return b.classDeclaration.from({
    body: b.classBody.from({
      body: [
        b.classProperty.from({
          access: 'protected',
          key: b.identifier('client'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_CLIENT),
            }),
          }),
          value: null,
        }),
        b.classMethod.from({
          body: b.blockStatement.from({
            body: [
              b.expressionStatement.from({
                expression: b.assignmentExpression.from({
                  left: b.memberExpression.from({
                    object: b.thisExpression(),
                    property: b.identifier('client'),
                  }),
                  operator: '=',
                  right: b.newExpression.from({
                    arguments: [
                      b.identifier('options'),
                    ],
                    callee: b.identifier(IDENTIFIER_HTTP_CLIENT),
                  }),
                }),
              }),
            ],
          }),
          key: b.identifier('constructor'),
          kind: 'constructor',
          params: [
            b.identifier.from({
              name: 'options',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsTypeReference.from({
                  typeName: b.identifier(IDENTIFIER_HTTP_CLIENT_OPTIONS),
                }),
              }),
            }),
          ],
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_RESOURCE_CLASS),
  });
}

function buildHttpResponseErrorClass(): namedTypes.ClassDeclaration {
  return b.classDeclaration.from({
    body: b.classBody.from({
      body: [
        b.classProperty.from({
          access: 'public',
          key: b.identifier('request'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_REQUEST),
            }),
          }),
          value: null,
        }),
        b.classProperty.from({
          access: 'public',
          key: b.identifier('response'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier(IDENTIFIER_HTTP_RESPONSE),
              typeParameters: b.tsTypeParameterInstantiation.from({
                params: [
                  b.tsAnyKeyword(),
                ],
              }),
            }),
          }),
          value: null,
        }),
        b.classProperty.from({
          access: 'public',
          key: b.identifier('type'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsUnionType.from({
              types: [
                b.tsLiteralType.from({
                  literal: b.stringLiteral.from({
                    value: 'response_error',
                  }),
                }),
              ],
            }),
          }),
          value: b.stringLiteral('response_error'),
        }),
        b.methodDefinition.from({
          key: b.identifier('constructor'),
          kind: 'constructor',
          value: b.functionExpression.from({
            body: b.blockStatement.from({
              body: [
                b.expressionStatement.from({
                  expression: b.callExpression.from({
                    arguments: [
                      b.stringLiteral('Response is outside the success status range'),
                    ],
                    callee: b.super(),
                  }),
                }),
                b.expressionStatement.from({
                  expression: b.assignmentExpression.from({
                    left: b.memberExpression.from({
                      object: b.thisExpression(),
                      property: b.identifier('name'),
                    }),
                    operator: '=',
                    right: b.memberExpression.from({
                      object: b.memberExpression.from({
                        object: b.thisExpression(),
                        property: b.identifier('constructor'),
                      }),
                      property: b.identifier('name'),
                    }),
                  }),
                }),
                b.expressionStatement.from({
                  expression: b.assignmentExpression.from({
                    left: b.memberExpression.from({
                      object: b.thisExpression(),
                      property: b.identifier('request'),
                    }),
                    operator: '=',
                    right: b.identifier('request'),
                  }),
                }),
                b.expressionStatement.from({
                  expression: b.assignmentExpression.from({
                    left: b.memberExpression.from({
                      object: b.thisExpression(),
                      property: b.identifier('response'),
                    }),
                    operator: '=',
                    right: b.identifier('response'),
                  }),
                }),
                b.ifStatement.from({
                  consequent: b.blockStatement.from({
                    body: [
                      b.expressionStatement.from({
                        expression: b.callExpression.from({
                          arguments: [
                            b.thisExpression(),
                            b.memberExpression.from({
                              object: b.thisExpression(),
                              property: b.identifier('constructor'),
                            }),
                          ],
                          callee: b.memberExpression.from({
                            object: b.identifier('Error'),
                            property: b.identifier('captureStackTrace'),
                          }),
                        }),
                      }),
                    ],
                  }),
                  test: b.callExpression.from({
                    arguments: [
                      b.stringLiteral('captureStackTrace'),
                    ],
                    callee: b.memberExpression.from({
                      object: b.identifier('Error'),
                      property: b.identifier('hasOwnProperty'),
                    }),
                  }),
                }),
              ],
            }),
            params: [
              b.identifier.from({
                name: 'request',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier(IDENTIFIER_HTTP_REQUEST),
                  }),
                }),
              }),
              b.identifier.from({
                name: 'response',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier(IDENTIFIER_HTTP_RESPONSE),
                    typeParameters: b.tsTypeParameterInstantiation.from({
                      params: [
                        b.tsAnyKeyword(),
                      ],
                    }),
                  }),
                }),
              }),
            ],
          }),
        }),
      ],
    }),
    id: b.identifier(IDENTIFIER_HTTP_RESPONSE_ERROR),
    superClass: b.identifier('Error'),
  });
}

function buildIsHttpResponseErrorFunction(): namedTypes.FunctionDeclaration {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.returnStatement.from({
          argument: b.logicalExpression.from({
            left: b.binaryExpression.from({
              left: b.identifier('error'),
              operator: '!=',
              right: b.nullLiteral(),
            }),
            operator: '&&',
            right: b.binaryExpression.from({
              left: b.memberExpression.from({
                object: b.identifier('error'),
                property: b.identifier('type'),
              }),
              operator: '===',
              right: b.stringLiteral('response_error'),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier('isHttpResponseError'),
    params: [
      b.identifier.from({
        name: 'error',
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsAnyKeyword(),
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypePredicate.from({
        parameterName: b.identifier('error'),
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier(IDENTIFIER_HTTP_RESPONSE_ERROR),
          }),
        }),
      }),
    }),
  });
}

function buildTSTypeKind(
  type: ApiBuilderType,
): TSTypeKind {
  if (isPrimitiveType(type)) {
    return buildPrimitiveTypeReference(type);
  }

  if (isMapType(type)) {
    return b.tsTypeReference.from({
      typeName: b.identifier('Record'),
      typeParameters: b.tsTypeParameterInstantiation.from({
        params: [
          b.tsStringKeyword(),
          buildTSTypeKind(type.ofType),
        ],
      }),
    });
  }

  if (isArrayType(type)) {
    return b.tsArrayType.from({
      elementType: buildTSTypeKind(type.ofType),
    });
  }

  return b.tsTypeReference.from({
    typeName: buildTypeQualifiedName(type),
  });
}

function getOperationParametersInterfaceName(
  operation: ApiBuilderOperation,
): string {
  return `${pascalCase(operation.resource.plural)}${pascalCase(operation.nickname)}Parameters`;
}

function getOperationQueryInterfaceName(
  operation: ApiBuilderOperation,
): string {
  return `${pascalCase(operation.resource.plural)}${pascalCase(operation.nickname)}Query`;
}

function buildOperationQueryInterface(
  operation: ApiBuilderOperation,
  context: Context,
): namedTypes.TSInterfaceDeclaration {
  const properties: namedTypes.TSPropertySignature[] = [];

  operation.parameters.filter((parameter) => {
    return parameter.location === 'Query';
  }).forEach((parameter) => {
    properties.push(b.tsPropertySignature.from({
      key: b.identifier(parameter.name),
      optional: !parameter.isRequired,
      typeAnnotation: buildTypeAnnotation(parameter.type, context),
    }));
  });

  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: properties,
    }),
    id: b.identifier(getOperationQueryInterfaceName(operation)),
  });
}

function buildOperationParameterProperties(
  operation: ApiBuilderOperation,
  context: Context,
): namedTypes.TSPropertySignature[] {
  const properties: namedTypes.TSPropertySignature[] = [];

  if (operation.body != null) {
    properties.push(b.tsPropertySignature.from({
      comments: operation.body.description != null ? [
        b.commentBlock.from({
          value: operation.body.description,
        }),
      ] : null,
      key: b.identifier('body'),
      optional: false,
      typeAnnotation: buildTypeAnnotation(operation.body.type, context),
    }));
  }

  properties.push(b.tsPropertySignature.from({
    key: b.identifier('headers'),
    optional: true,
    typeAnnotation: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier(IDENTIFIER_HTTP_HEADERS),
      }),
    }),
  }));

  operation.parameters.forEach((parameter) => {
    const comments: namedTypes.CommentBlock[] = [];

    if (parameter.description != null) {
      comments.push(b.commentBlock.from({
        value: parameter.description,
      }));
    }

    properties.push(b.tsPropertySignature.from({
      comments,
      key: b.identifier(parameter.name),
      optional: !parameter.isRequired || parameter.defaultValue != null,
      typeAnnotation: buildTypeAnnotation(parameter.type, context),
    }));
  });

  return properties;
}

function buildOperationParameterInterfaceIdentifier(
  operation: ApiBuilderOperation,
): namedTypes.Identifier {
  return b.identifier.from({
    name: pascalCase(`${operation.resource.plural} ${operation.nickname} parameters`),
  });
}

function buildOperationParametersInterfaceDeclaration(
  operation: ApiBuilderOperation,
  context: Context,
): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: buildOperationParameterProperties(operation, context),
    }),
    id: buildOperationParameterInterfaceIdentifier(operation),
  });
}

function buildOperationParametersInterfaceDeclarations(
  resource: ApiBuilderResource,
  context: Context,
): namedTypes.TSInterfaceDeclaration[] {
  return resource.operations.map((operation) => {
    return buildOperationParametersInterfaceDeclaration(operation, context);
  });
}

function buildOperationResponseTypeAliasIdentifier(
  operation: ApiBuilderOperation,
): namedTypes.Identifier {
  return b.identifier.from({
    name: pascalCase(`${operation.resource.plural} ${operation.nickname} response`),
  });
}

function buildOperationResponseTypeAliasDeclaration(
  operation: ApiBuilderOperation,
  context: Context,
): namedTypes.TSTypeAliasDeclaration {
  const responseTypes = b.tsUnionType.from({
    types: operation.responses.map((response) => {
      return b.tsTypeReference.from({
        typeName: buildHttpResponseCodeIdentifier(response.code),
        typeParameters: b.tsTypeParameterInstantiation.from({
          params: [
            buildType(response.type, context),
          ],
        }),
      });
    }),
  });

  if (responseTypes.types.length === 0) {
    responseTypes.types = [
      b.tsUndefinedKeyword(),
    ];
  }

  return b.tsTypeAliasDeclaration.from({
    id: buildOperationResponseTypeAliasIdentifier(operation),
    typeAnnotation: responseTypes,
  });
}

function buildOperationResponseTypeAliasDeclarations(
  resource: ApiBuilderResource,
  context: Context,
): namedTypes.TSTypeAliasDeclaration[] {
  return resource.operations.map((operation) => {
    return buildOperationResponseTypeAliasDeclaration(operation, context);
  });
}

function buildOperationParametersTypeLiteral(
  operation: ApiBuilderOperation,
  context: Context,
): namedTypes.TSTypeLiteral {
  return b.tsTypeLiteral.from({
    members: buildOperationParameterProperties(operation, context),
  });
}

function getResourceIdentifier(
  resource: ApiBuilderResource,
): namedTypes.Identifier {
  return b.identifier(`${pascalCase(resource.plural)}Resource`);
}

function buildResourceClassMethods(
  resource: ApiBuilderResource,
  context: Context,
): namedTypes.ClassMethod[] {
  const methods: namedTypes.ClassMethod[] = [];

  resource.operations.forEach((operation) => {
    const hasBody = operation.body != null;
    const hasParameters = operation.parameters.length > 0;
    const hasPathParameters = operation.parameters.some(_ => _.location === 'Path');
    const hasRequiredParameters = operation.parameters.some(_ => _.isRequired);

    const queryProperties: namedTypes.Property[] = operation.parameters.filter((_) => {
      return _.location === 'Query';
    }).sort((paramA, paramB) => {
      return stringCompare(paramA.name, paramB.name);
    }).map((_) => {
      return b.property.from({
        key: b.identifier(_.name),
        kind: 'init',
        value: b.memberExpression.from({
          object: b.identifier('params'),
          property: b.identifier(_.name),
        }),
      });
    });

    let methodParameter: PatternKind = b.identifier.from({
      name: 'params',
      typeAnnotation: b.tsTypeAnnotation.from({
        typeAnnotation: b.tsTypeReference.from({
          typeName: buildOperationParameterInterfaceIdentifier(operation),
        }),
      }),
    });

    methodParameter = (hasBody || hasRequiredParameters)
      ? methodParameter
      : b.assignmentPattern.from({
        left: methodParameter,
        right: b.objectExpression.from({
          properties: [],
        }),
      });

    const urlLiteral = hasPathParameters ? b.templateLiteral.from({
      expressions: operation.path.split(/\/|\./).filter((_) => {
        return _.startsWith(':');
      }).map((_) => {
        return b.callExpression.from({
          arguments: [
            b.memberExpression.from({
              object: b.identifier('params'),
              property: b.identifier(_.slice(1)),
            }),
          ],
          callee: b.identifier('encodeURIComponent'),
        });
      }),
      quasis: operation.path.split(/:[^./]+/).map((part, index, self) => {
        const lastIndex = self.length - 1;
        return b.templateElement.from({
          tail: index === lastIndex,
          value: {
            cooked: part,
            raw: part,
          },
        });
      }),
    }) : b.stringLiteral(operation.path);

    const requestProperties: namedTypes.Property[] = [];

    if (operation.body != null) {
      requestProperties.push(b.property.from({
        key: b.identifier('body'),
        kind: 'init',
        value: b.memberExpression.from({
          object: b.identifier('params'),
          property: b.identifier('body'),
        }),
      }));
    }

    requestProperties.push(b.property.from({
      key: b.identifier('endpoint'),
      kind: 'init',
      value: urlLiteral,
    }));

    requestProperties.push(b.property.from({
      key: b.identifier('headers'),
      kind: 'init',
      value: b.memberExpression.from({
        object: b.identifier('params'),
        property: b.identifier('headers'),
      }),
    }));

    requestProperties.push(b.property.from({
      key: b.identifier('method'),
      kind: 'init',
      value: b.stringLiteral(operation.method),
    }));

    if (queryProperties.length) {
      requestProperties.push(b.property.from({
        key: b.identifier('query'),
        kind: 'init',
        value: b.objectExpression.from({
          properties: queryProperties,
        }),
      }));
    }

    const responseTypes = b.tsUnionType.from({
      types: operation.responses.map((response) => {
        return b.tsTypeReference.from({
          typeName: buildHttpResponseCodeIdentifier(response.code),
          typeParameters: b.tsTypeParameterInstantiation.from({
            params: [
              buildType(response.type, context),
            ],
          }),
        });
      }),
    });

    if (responseTypes.types.length === 0) {
      responseTypes.types = [
        b.tsUndefinedKeyword(),
      ];
    }

    methods.push(b.classMethod.from({
      access: 'public',
      body: b.blockStatement.from({
        body: [
          b.returnStatement.from({
            argument: b.callExpression.from({
              arguments: [
                b.objectExpression.from({
                  properties: requestProperties,
                }),
              ],
              callee: b.memberExpression.from({
                object: b.memberExpression.from({
                  object: b.thisExpression(),
                  property: b.identifier('client'),
                }),
                property: b.identifier('request'),
              }),
            }),
          }),
        ],
      }),
      comments: operation.description != null ? [
        b.commentBlock(operation.description),
      ] : [],
      key: b.identifier(operation.nickname),
      params: [
        methodParameter,
      ],
      returnType: b.tsTypeAnnotation.from({
        typeAnnotation: b.tsTypeReference.from({
          typeName: b.identifier('Promise'),
          typeParameters: b.tsTypeParameterInstantiation.from({
            params: [
              b.tsTypeReference.from({
                typeName: buildOperationResponseTypeAliasIdentifier(operation),
              }),
            ],
          }),
        }),
      }),
    }));
  });

  return methods;
}

export function buildResourceClass(
  resource: ApiBuilderResource,
  context: Context,
): namedTypes.ClassDeclaration {
  const methods = buildResourceClassMethods(resource, context);

  return b.classDeclaration.from({
    body: b.classBody.from({
      body: methods,
    }),
    id: getResourceIdentifier(resource),
    superClass: b.identifier(IDENTIFIER_RESOURCE_CLASS),
  });
}

function buildClientInstanceInterface(
  context: Context,
) {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: context.rootService.resources.map(_ => b.tsPropertySignature.from({
        key: b.identifier(camelCase(_.plural)),
        optional: false,
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: getResourceIdentifier(_),
          }),
        }),
      })),
    }),
    id: b.identifier('ClientInstance'),
  });
}

function buildCreateClientFunction(
  context: Context,
) {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.returnStatement.from({
          argument: b.objectExpression.from({
            properties: context.rootService.resources.map(_ => b.property.from({
              key: b.identifier(camelCase(_.plural)),
              kind: 'init',
              value: b.newExpression.from({
                arguments: [
                  b.identifier('options'),
                ],
                callee: getResourceIdentifier(_),
              }),
            })),
          }),
        }),
      ],
    }),
    id: b.identifier('createClient'),
    params: [
      b.identifier.from({
        name: 'options',
        optional: false,
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier(IDENTIFIER_HTTP_CLIENT_OPTIONS),
          }),
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier('ClientInstance'),
      }),
    }),
  });
}

export function buildInternalTypeDeclarations(): TSTypeDeclaration[] {
  const initial: TSTypeDeclaration[] = [];
  return initial.concat(
    buildFetchOptions(),
    buildFetchFunction(),
    buildHttpHeaders(),
    buildHttpMethod(),
    buildHttpQuery(),
    buildHttpRequest(),
    buildHttpRequestOptions(),
    buildHttpResponse(),
    buildHttpStatusCodes(),
    buildHttpClientOptions(),
  );
}

function buildInternalTypes(): namedTypes.TSModuleDeclaration {
  return b.tsModuleDeclaration.from({
    body: b.tsModuleBlock.from({
      body: buildInternalTypeDeclarations().map(buildExportNamedDeclaration),
    }),
    id: b.identifier(IDENTIFIER_INTERNAL_NAMESPACE),
  });
}

function buildImportDeclarations() {
  return b.importDeclaration.from({
    source: b.stringLiteral('url'),
    specifiers: [
      b.importNamespaceSpecifier.from({
        id: b.identifier('url'),
      }),
    ],
  });
}

function buildHttpStatusCodes(): namedTypes.TSTypeAliasDeclaration[] {
  return Object.entries(httpStatusCodes).map(([statusCode, statusText]) => {
    return b.tsTypeAliasDeclaration.from({
      id: buildHttpResponseCodeIdentifier(statusCode),
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier(IDENTIFIER_HTTP_RESPONSE),
        typeParameters: b.tsTypeParameterInstantiation.from({
          params: [
            b.tsTypeReference.from({
              typeName: b.identifier('T'),
            }),
            b.tsLiteralType.from({
              literal: b.numericLiteral.from({
                value: Number.parseInt(statusCode, 10),
              }),
            }),
            b.tsLiteralType.from({
              literal: b.booleanLiteral.from({
                value: isOk(statusCode),
              }),
            }),
          ],
        }),
      }),
      typeParameters: b.tsTypeParameterDeclaration.from({
        params: [
          b.tsTypeParameter('T'),
        ],
      }),
    });
  });
}

export function buildStripQueryFunction(): namedTypes.FunctionDeclaration {
  return b.functionDeclaration.from({
    body: b.blockStatement.from({
      body: [
        b.variableDeclaration.from({
          declarations: [
            b.variableDeclarator.from({
              id: b.identifier.from({
                name: 'initialValue',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier.from({
                      name: IDENTIFIER_HTTP_QUERY,
                    }),
                  }),
                }),
              }),
              init: b.objectExpression.from({
                properties: [],
              }),
            }),
          ],
          kind: 'const',
        }),
        b.returnStatement.from({
          argument: b.callExpression.from({
            arguments: [
              b.arrowFunctionExpression.from({
                body: b.blockStatement.from({
                  body: [
                    b.variableDeclaration.from({
                      declarations: [
                        b.variableDeclarator.from({
                          id: b.identifier.from({
                            name: 'value',
                          }),
                          init: b.memberExpression.from({
                            computed: true,
                            object: b.identifier.from({
                              name: 'query',
                            }),
                            property: b.identifier.from({
                              name: 'key',
                            }),
                          }),
                        }),
                      ],
                      kind: 'const',
                    }),
                    b.ifStatement.from({
                      consequent: b.expressionStatement.from({
                        expression: b.assignmentExpression.from({
                          left: b.memberExpression.from({
                            computed: true,
                            object: b.identifier.from({
                              name: 'previousValue',
                            }),
                            property: b.identifier.from({
                              name: 'key',
                            }),
                          }),
                          operator: '=',
                          right: b.identifier.from({
                            name: 'value',
                          }),
                        }),
                      }),
                      test: b.binaryExpression.from({
                        left: b.identifier.from({
                          name: 'value',
                        }),
                        operator: '!=',
                        right: b.nullLiteral(),
                      }),
                    }),
                    b.returnStatement.from({
                      argument: b.identifier.from({
                        name: 'previousValue',
                      }),
                    }),
                  ],
                }),
                params: [
                  b.identifier.from({
                    name: 'previousValue',
                  }),
                  b.identifier.from({
                    name: 'key',
                  }),
                ],
              }),
              b.identifier.from({
                name: 'initialValue',
              }),
            ],
            callee: b.memberExpression.from({
              object: b.callExpression.from({
                arguments: [
                  b.identifier.from({
                    name: 'query',
                  }),
                ],
                callee: b.memberExpression.from({
                  object: b.identifier.from({
                    name: 'Object',
                  }),
                  property: b.identifier.from({
                    name: 'keys',
                  }),
                }),
              }),
              property: b.identifier.from({
                name: 'reduce',
              }),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: IDENTIFIER_STRIP_QUERY,
    }),
    params: [
      b.assignmentPattern.from({
        left: b.identifier.from({
          name: 'query',
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier.from({
                name: IDENTIFIER_HTTP_QUERY,
              }),
            }),
          }),
        }),
        right: b.objectExpression.from({
          properties: [],
        }),
      }),
    ],
    returnType: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier.from({
          name: IDENTIFIER_HTTP_QUERY,
        }),
      }),
    }),
  });
}

function buildFile(
  context: Context,
): namedTypes.File {
  const { rootService } = context;

  const namedExports = ([] as DeclarationKind[]).concat(
    buildInternalTypeDeclarations(),
    buildIsResponseEmptyFunction(),
    buildIsResponseJsonFunction(),
    buildParseJsonFunction(),
    buildParseHeadersFunction(),
    buildStripQueryFunction(),
    buildHttpClientClass(context),
    buildBaseResourceClass(),
    flatMap(rootService.resources, (resource): DeclarationKind[] => {
      return buildOperationParametersInterfaceDeclarations(resource, context);
    }),
    flatMap(rootService.resources, (resource): DeclarationKind[] => {
      return buildOperationResponseTypeAliasDeclarations(resource, context);
    }),
    rootService.resources.map((resource) => {
      return buildResourceClass(resource, context);
    }),
    buildClientInstanceInterface(context),
    buildCreateClientFunction(context),
  ).map((declaration) => {
    return buildExportNamedDeclaration(declaration);
  });

  const statements = ([] as StatementKind[]).concat(
    buildImportDeclarations(),
    namedExports,
  );

  const comments: namedTypes.CommentBlock[] = [];

  if (process.env.NODE_ENV !== 'production') {
    comments.push(b.commentBlock.from({
      value: 'tslint:disable interface-name object-shorthand-properties-first no-namespace max-classes-per-file max-line-length trailing-comma',
    }));
  }

  return b.file.from({
    comments,
    program: b.program.from({
      body: statements,
    }),
  });
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return new Promise((resolve) => {
    const context = buildContext(invocationForm);

    if (context.unresolvedTypes.length) {
      log(`WARN: The following types could not be resolved and will be ignored ${JSON.stringify(context.unresolvedTypes)}`);
    }

    if (!context.rootService.resources.length) {
      log(`WARN: No files will be generated since ${context.rootService.applicationKey} does not contain any resources`);
    }

    const ast = buildFile(context);
    const basename = `${context.rootService.applicationKey}.ts`;
    const dirname = context.rootService.namespace.split('.').join('/');
    const { code } = print(ast, {
      arrayBracketSpacing: true,
      arrowParensAlways: true,
      objectCurlySpacing: true,
      quote: 'single',
      reuseWhitespace: true,
      tabWidth: 2,
      trailingComma: true,
      useTabs: false,
    });

    resolve([
      new ApiBuilderFile(basename, dirname, code),
    ]);
  });
}
