import {
  ApiBuilderEnum,
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderModel,
  ApiBuilderOperation,
  ApiBuilderPrimitiveType,
  ApiBuilderResource,
  ApiBuilderType,
  ApiBuilderUnion,
  isArrayType,
  isMapType,
  isPrimitiveType,
  Kind,
} from 'apibuilder-js';
import { builders as b, namedTypes } from 'ast-types';
import { DeclarationKind, PatternKind, StatementKind, TSTypeKind } from 'ast-types/gen/kinds';
import debug from 'debug';
import { camelCase, upperFirst } from 'lodash';
import { print } from 'recast';
import url from 'url';

import {
  buildContext,
  buildModuleDeclarations,
  buildTypeIdentifier,
  buildTypeQualifiedName,
  buildTypeReference,
  Context,
} from '../../builders';

const log = debug('apibuilder:ts_service');

function pascalCase(
  value: string,
): string {
  return upperFirst(camelCase(value));
}

function stripTrailingSlash(
  value: string,
): string {
  if (value.endsWith('/')) return value.slice(0, -1);
  return value;
}

function stringCompare(s1: string, s2: string) {
  if (s1 > s2) return 1;
  if (s1 < s2) return -1;
  return 0;
}

function shortNameCompare(
  t1: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
  t2: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
): number {
  return stringCompare(t1.shortName, t2.shortName);
}

function buildExportNamedDeclaration(
  declaration: DeclarationKind,
): namedTypes.ExportNamedDeclaration {
  return b.exportNamedDeclaration.from({
    declaration,
  });
}

function buildTypeDeclarations(
  context: Context,
): namedTypes.TSTypeAliasDeclaration[] {
  const { rootService } = context;
  const types = [].concat(rootService.enums).concat(rootService.models).concat(rootService.unions);
  return types.sort(shortNameCompare).map(type =>
    b.tsTypeAliasDeclaration(buildTypeIdentifier(type), buildTypeReference(type)),
  );
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
      return b.tsVoidKeyword();
    case Kind.OBJECT:
    default:
      return b.tsAnyKeyword();
  }
}

function buildJSONPrimitiveType(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier.from({
      name: 'JSONPrimitive',
    }),
    typeAnnotation: b.tsUnionType.from({
      types: [
        b.tsStringKeyword(),
        b.tsNumberKeyword(),
        b.tsBooleanKeyword(),
        b.tsNullKeyword(),
      ],
    }),
  });
}

function buildJSONValueType(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier.from({
      name: 'JSONValue',
    }),
    typeAnnotation: b.tsUnionType.from({
      types: [
        b.tsTypeReference.from({
          typeName: b.identifier.from({
            name: 'JSONPrimitive',
          }),
        }),
        b.tsTypeReference.from({
          typeName: b.identifier.from({
            name: 'JSONArray',
          }),
        }),
        b.tsTypeReference.from({
          typeName: b.identifier.from({
            name: 'JSONObject',
          }),
        }),
      ],
    }),
  });
}

function buildJSONArrayType(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier.from({
      name: 'JSONArray',
    }),
    typeAnnotation: b.tsArrayType.from({
      elementType: b.tsTypeReference.from({
        typeName: b.identifier.from({
          name: 'JSONValue',
        }),
      }),
    }),
  });
}

function buildJSONObjectInterface(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsIndexSignature.from({
          parameters: [
            b.identifier.from({
              name: 'key',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsTypeReference.from({
                  typeName: b.identifier.from({
                    name: 'string',
                  }),
                }),
              }),
            }),
          ],
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation:  b.tsTypeReference.from({
              typeName: b.identifier.from({
                name: 'JSONValue',
              }),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: 'JSONObject',
    }),
  });
}

function buildFetchFunctionType(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier('FetchFunction'),
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
              typeName: b.identifier('RequestInit'),
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

function buildHttpClientMethodType(): namedTypes.TSTypeAliasDeclaration {
  return b.tsTypeAliasDeclaration.from({
    id: b.identifier.from({
      name: 'HttpClientMethod',
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

function buildHttpClientHeadersInterface(): namedTypes.TSInterfaceDeclaration {
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
    id: b.identifier('HttpClientHeaders'),
  });
}

function buildHttpClientQueryInterface(): namedTypes.TSInterfaceDeclaration {
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
    id: b.identifier('HttpClientQuery'),
  });
}

function buildHttpClientRequestInterface(): namedTypes.TSInterfaceDeclaration {
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
            name: 'headers',
          }),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier.from({
                name: 'HttpClientHeaders',
              }),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'method',
          }),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier.from({
                name: 'HttpClientMethod',
              }),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier.from({
            name: 'pathname',
          }),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('query'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('HttpClientQuery'),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier.from({
      name: 'HttpClientRequest',
    }),
  });
}

function buildHttpClientResponseInterface(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier('body'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('T'),
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
              typeName: b.identifier.from({
                name: 'HttpClientHeaders',
              }),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('request'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('HttpClientRequest'),
            }),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('statusCode'),
          optional: false,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsNumberKeyword(),
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
      name: 'HttpClientResponse',
    }),
    typeParameters: b.tsTypeParameterDeclaration.from({
      params: [
        b.tsTypeParameter.from({
          name: 'T',
        }),
      ],
    }),
  });
}

function buildHttpClientOptionsInterface(): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: [
        b.tsPropertySignature.from({
          key: b.identifier('baseUrl'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsStringKeyword(),
          }),
        }),
        b.tsPropertySignature.from({
          key: b.identifier('fetch'),
          optional: true,
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('FetchFunction'),
            }),
          }),
        }),
      ],
    }),
    id: b.identifier('HttpClientOptions'),
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
  return b.classDeclaration.from({
    body: b.classBody.from({
      body: [
        b.classProperty.from({
          access: 'private',
          key: b.identifier('fetch'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('FetchFunction'),
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
                    property: b.identifier('fetch'),
                  }),
                  operator: '=',
                  right: b.conditionalExpression.from({
                    alternate: b.identifier('fetch'),
                    consequent: b.memberExpression.from({
                      object: b.identifier('options'),
                      property: b.identifier('fetch'),
                    }),
                    test: b.binaryExpression.from({
                      left: b.memberExpression.from({
                        object: b.identifier('options'),
                        property: b.identifier('fetch'),
                      }),
                      operator: '!=',
                      right: b.nullLiteral(),
                    }),
                  }),
                }),
              }),
            ],
          }),
          key: b.identifier('constructor'),
          kind: 'constructor',
          params: [
            b.assignmentPattern.from({
              left: b.identifier.from({
                name: 'options',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier('HttpClientOptions'),
                  }),
                }),
              }),
              right: b.objectExpression.from({
                properties: [],
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
                    id: b.identifier('location'),
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
                              value: pathname == null ? b.memberExpression.from({
                                object: b.identifier('request'),
                                property: b.identifier('pathname'),
                              }) : b.binaryExpression.from({
                                left: b.stringLiteral(stripTrailingSlash(pathname)),
                                operator: '+',
                                right: b.memberExpression.from({
                                  object: b.identifier('request'),
                                  property: b.identifier('pathname'),
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
                              value: b.memberExpression.from({
                                object: b.identifier('request'),
                                property: b.identifier('query'),
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
                    id: b.identifier('headers'),
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
                            object: b.identifier('request'),
                            property: b.identifier('headers'),
                          }),
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
                          b.ifStatement.from({
                            consequent: b.returnStatement.from({
                              argument: b.memberExpression.from({
                                object: b.identifier('response'),
                                property: b.identifier('body'),
                              }),
                            }),
                            test: b.logicalExpression.from({
                              left: b.binaryExpression.from({
                                left: b.memberExpression.from({
                                  object: b.identifier('response'),
                                  property: b.identifier('statusCode'),
                                }),
                                operator: '>=',
                                right: b.numericLiteral(200),
                              }),
                              operator: '&&',
                              right: b.binaryExpression.from({
                                left: b.memberExpression.from({
                                  object: b.identifier('response'),
                                  property: b.identifier('statusCode'),
                                }),
                                operator: '<',
                                right: b.numericLiteral(300),
                              }),
                            }),
                          }),
                          b.throwStatement.from({
                            argument: b.newExpression.from({
                              arguments: [
                                b.identifier('response'),
                              ],
                              callee: b.identifier('ResponseError'),
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
                                                  key: b.identifier('request'),
                                                  shorthand: true,
                                                  value: b.identifier('request'),
                                                }),
                                                b.objectProperty.from({
                                                  key: b.identifier('statusCode'),
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
                            b.identifier('location'),
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
                                  shorthand: true,
                                  value: b.identifier('headers'),
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
                            object: b.thisExpression(),
                            property: b.identifier('fetch'),
                          }),
                        }),
                        property: b.identifier('then'),
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
              name: 'request',
              typeAnnotation: b.tsTypeAnnotation.from({
                typeAnnotation: b.tsTypeReference.from({
                  typeName: b.identifier('HttpClientRequest'),
                }),
              }),
            }),
          ],
          returnType: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('Promise'),
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
    id: b.identifier('HttpClient'),
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
          argument: b.binaryExpression.from({
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
              typeName: b.identifier('HttpClient'),
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
                    callee: b.identifier('HttpClient'),
                  }),
                }),
              }),
            ],
          }),
          key: b.identifier('constructor'),
          kind: 'constructor',
          params: [
            b.assignmentPattern.from({
              left: b.identifier.from({
                name: 'options',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier('HttpClientOptions'),
                  }),
                }),
              }),
              right: b.objectExpression.from({
                properties: [],
              }),
            }),
          ],
        }),
      ],
    }),
    id: b.identifier('BaseResource'),
  });
}

function buildResponseErrorClass(): namedTypes.ClassDeclaration {
  return b.classDeclaration.from({
    body: b.classBody.from({
      body: [
        b.classProperty.from({
          access: 'public',
          key: b.identifier('response'),
          typeAnnotation: b.tsTypeAnnotation.from({
            typeAnnotation: b.tsTypeReference.from({
              typeName: b.identifier('HttpClientResponse'),
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
                      b.stringLiteral('Response is outside the 2xx status code range'),
                    ],
                    callee: b.super(),
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
              ],
            }),
            params: [
              b.identifier.from({
                name: 'response',
                typeAnnotation: b.tsTypeAnnotation.from({
                  typeAnnotation: b.tsTypeReference.from({
                    typeName: b.identifier('HttpClientResponse'),
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
    id: b.identifier('ResponseError'),
    superClass: b.identifier('BaseError'),
  });
}

function buildIsResponseErrorFunction(): namedTypes.FunctionDeclaration {
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
    id: b.identifier('isResponseError'),
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
            typeName: b.identifier('ResponseError'),
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
): namedTypes.TSInterfaceDeclaration {
  const properties: namedTypes.TSPropertySignature[] = [];

  operation.parameters.filter((parameter) => {
    return parameter.location === 'Query';
  }).forEach((parameter) => {
    properties.push(b.tsPropertySignature.from({
      key: b.identifier(parameter.name),
      optional: !parameter.isRequired,
      typeAnnotation: b.tsTypeAnnotation.from({
        typeAnnotation: buildTSTypeKind(parameter.type),
      }),
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
      typeAnnotation: b.tsTypeAnnotation.from({
        typeAnnotation: buildTSTypeKind(operation.body.type),
      }),
    }));
  }

  properties.push(b.tsPropertySignature.from({
    key: b.identifier('headers'),
    optional: true,
    typeAnnotation: b.tsTypeAnnotation.from({
      typeAnnotation: b.tsTypeReference.from({
        typeName: b.identifier('HttpClientHeaders'),
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
      optional: !parameter.isRequired,
      typeAnnotation: b.tsTypeAnnotation.from({
        typeAnnotation: buildTSTypeKind(parameter.type),
      }),
    }));
  });

  return properties;
}

function buildOperationParametersInterface(
  operation: ApiBuilderOperation,
): namedTypes.TSInterfaceDeclaration {
  return b.tsInterfaceDeclaration.from({
    body: b.tsInterfaceBody.from({
      body: buildOperationParameterProperties(operation),
    }),
    id: b.identifier(getOperationParametersInterfaceName(operation)),
  });
}

function buildOperationParametersTypeLiteral(
  operation: ApiBuilderOperation,
): namedTypes.TSTypeLiteral {
  return b.tsTypeLiteral.from({
    members: buildOperationParameterProperties(operation),
  });
}

function getResourceIdentifier(
  resource: ApiBuilderResource,
): namedTypes.Identifier {
  let name: string = pascalCase(resource.plural);
  name += 'Resource';
  return b.identifier(name);
}

function buildResourceClass(
  resource: ApiBuilderResource,
): namedTypes.ClassDeclaration {
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
        typeAnnotation: buildOperationParametersTypeLiteral(operation),
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

    requestProperties.push(b.property.from({
      key: b.identifier('pathname'),
      kind: 'init',
      value: urlLiteral,
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

    const responseType = b.tsUnionType.from({
      types: operation.responses.filter((_) => {
        return _.code >= 200 && _.code < 300;
      }).filter((_, index, self) => {
        return self.findIndex((response) => {
          return _.type.toString() === response.type.toString();
        }) === index;
      }).map((_) => {
        return buildTSTypeKind(_.type);
      }),
    });

    if (responseType.types.length === 0) {
      responseType.types = [
        b.tsVoidKeyword(),
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
              responseType,
            ],
          }),
        }),
      }),
    }));
  });

  return b.classDeclaration.from({
    body: b.classBody.from({
      body: methods,
    }),
    id: getResourceIdentifier(resource),
    superClass: b.identifier('BaseResource'),
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
        optional: true,
        typeAnnotation: b.tsTypeAnnotation.from({
          typeAnnotation: b.tsTypeReference.from({
            typeName: b.identifier('HttpClientOptions'),
          }),
        }),
      }),
    ],
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

function buildFile(
  context: Context,
): namedTypes.File {
  const { rootService } = context;

  const namedExports = [].concat(
    buildTypeDeclarations(context),
    // buildJSONPrimitiveType(),
    // buildJSONValueType(),
    // buildJSONArrayType(),
    // buildJSONObjectInterface(),
    buildFetchFunctionType(),
    buildHttpClientMethodType(),
    buildHttpClientHeadersInterface(),
    buildHttpClientQueryInterface(),
    buildHttpClientRequestInterface(),
    buildHttpClientResponseInterface(),
    buildHttpClientOptionsInterface(),
    buildBaseErrorClass(),
    buildResponseErrorClass(),
    buildIsResponseErrorFunction(),
    buildIsResponseEmptyFunction(),
    buildIsResponseJsonFunction(),
    buildParseJsonFunction(),
    buildParseHeadersFunction(),
    buildHttpClientClass(context),
    buildBaseResourceClass(),
    rootService.resources.map(_ => buildResourceClass(_)),
    buildCreateClientFunction(context),
  ).map(_ => buildExportNamedDeclaration(_));

  const statements: StatementKind[] = [].concat(
    buildImportDeclarations(),
    buildModuleDeclarations(context),
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
