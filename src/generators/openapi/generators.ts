import debug from 'debug';
import {
  filter,
  flatten,
  get,
  groupBy,
  isEmpty,
  map,
  mapValues,
  negate,
  reduce,
  some,
} from 'lodash';

import {
  ComponentsObject,
  InfoObject,
  OpenAPIObject,
  OperationObject,
  ParameterLocation,
  ParameterObject,
  PathsObject,
  ReferenceObject,
  ResponseObject,
  ResponsesObject,
  SchemaObject,
} from '@loopback/openapi-v3-types';
import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderField,
  ApiBuilderHeaderConfig,
  ApiBuilderModel,
  ApiBuilderOperation,
  ApiBuilderParameter,
  ApiBuilderParameterLocation,
  ApiBuilderPrimitiveType,
  ApiBuilderResource,
  ApiBuilderResponse,
  ApiBuilderService,
  ApiBuilderType,
  ApiBuilderUnion,
  Kind,
} from 'apibuilder-js';

const log = debug('apibuilder:openapi');

// function convertLocationToIn(location: ApiBuilderParameterLocation): ParameterLocation {
//   switch (location) {
//     case ApiBuilderParameterLocation.Path: return 'path';
//     case ApiBuilderParameterLocation.Query: return 'query';
//     case ApiBuilderParameterLocation.Header: return 'header';
//     case ApiBuilderParameterLocation.Form: return 'header';
//   }
// }

// function generateParameterObject(apibuilderParameter: ApiBuilderParameter): ParameterObject {
//   const {
//     description: apibuilderDescription,
//     deprecation: apibuilderDeprecation,
//     isRequired,
//     name,
//     location,
//   } = apibuilderParameter;

//   const parameterConversionWarning = `\
// Apibuilder defined this parameter location as "Form" which is incompatible with the OpenAPI spec.`;

//   const description = (location === ApiBuilderParameterLocation.Form)
//     ? apibuilderDescription + parameterConversionWarning : apibuilderDescription;

//   const shorthand = {
//     description,
//     name,
//   };

//   const parameterObj = {
//     deprecated: Boolean(get(apibuilderDeprecation, 'description')),
//     in: convertLocationToIn(location as ApiBuilderParameterLocation),
//     required: isRequired,
//     ...shorthand,
//   };

//   return parameterObj;
// }

// function generateHeaderObjects(headers: ReadonlyArray<ApiBuilderHeaderConfig>) {
//   return reduce(
//     headers,
//     (acc, value) => {
//       const {
//         description: apibuilderHeaderDescription,
//         deprecation,
//         required,
//         type,
//       } = value;

//       // tslint-ignore-next-line
//       const description = `Header generated from Apibuilder\
//       spec of type ${type}. ${apibuilderHeaderDescription}`;

//       acc[value.name] = {
//         deprecation,
//         description,
//         required,
//       };
//       return acc;
//     },
//     {},
//   );
// }

// function generateResponseObject(response: ApiBuilderResponse): ResponseObject {
//   const {
//     description,
//     headers,
//     type,
//   } = response;

//   return {
//     description: String(description || type),
//     headers: generateHeaderObjects(headers),
//   };
// }

// function generateResponsesObject(
//   apibuilderOperationResponses,
// ): ResponsesObject {
//   const responses = reduce(
//     apibuilderOperationResponses,
//     (acc, value) => {
//       const response = new ApiBuilderResponse(value.config, value.service);
//       const code = response.code;
//       const isDefault = response.isDefault;
//       const key = (isDefault) ? 'default' : code;
//       acc[key] = generateResponseObject(response);

//       return acc;
//     },
//     {},
//   );

//   return responses;
// }

// function generateOperationObject(apibuilderOperation: ApiBuilderOperation): OperationObject {
//   return {
//     description: apibuilderOperation.description,
//     parameters: map(apibuilderOperation.parameters, generateParameterObject),
//     responses: generateResponsesObject(apibuilderOperation.responses),
//   };
// }

// function extractApiBuilderOperations(resources: ApiBuilderResource[]) {
//   const mapped = map(resources, resource => resource.operations);
//   const flattened = flatten(mapped);
//   return groupBy(flattened, operation => operation.path);
// }

// function convertApiBuilderPrimitiveType(type: ApiBuilderPrimitiveType) {
//   switch (type.baseTypeName) {
//     case Kind.BOOLEAN: return { type: 'boolean' };
//     case Kind.DATE_ISO8601: return { type: 'string', format: 'date' };
//     case Kind.DATE_TIME_ISO8601: return { type: 'string', format: 'date-time' };
//     case Kind.DECIMAL: return { type: 'number', format: 'float' };
//     case Kind.DOUBLE: return { type: 'number', format: 'double' };
//     case Kind.INTEGER: return { type: 'integer' };
//     case Kind.JSON: return { AnyValue: {} };
//     case Kind.LONG: return { type: 'integer', format: 'int64' };
//     case Kind.OBJECT: return { type: 'object' };
//     case Kind.STRING: return { type: 'string' };
//     case Kind.UNIT: return { type: 'integer', nullable: true };
//     case Kind.UUID: return { type: 'string', format: 'uuid' };
//   }
// }

// function convertBuilderTypeToReference(
//   type: ApiBuilderModel | ApiBuilderEnum | ApiBuilderUnion,
// ): ReferenceObject {
//   return {
//     $ref: `#/components/schemas/${type.shortName}`,
//   };
// }

// function convertApiBuilderArray(array: ApiBuilderArray, validate) {
//   const type = array.ofType;
//   return {
//     items: convertApiBuilderType(type, validate),
//     type: 'array',
//   };
// }

// function typeValidator(service: ApiBuilderService) {
//   return function validator(builderType) {
//     const type = service.findTypeByName(builderType.baseTypeName);
//     return Boolean(type);
//   };
// }

// function generateProperties(fields: ApiBuilderField[], validate) {
//   return reduce(
//     fields,
//     (acc, value) => {
//       acc[value.name] = convertApiBuilderType(value.type, validate);
//       return acc;
//     },
//     {},
//   );
// }

// function generateSchemaFromEnum(enm) {
//   const enumValues = map(enm.values, value => value.name);
//   return {
//     [enm.name]: {
//       ...enm.description && { description: enm.description },
//       ...enm.isDeprecated && { deprecated: enm.isDeprecated },
//       enum: enumValues,
//       type: 'string',
//     },
//   };
// }

// function generateSchemaEnums(service: ApiBuilderService) {
//   return map(service.enums, enm => generateSchemaFromEnum(enm));
// }

// function convertApiBuilderType(type: ApiBuilderType, validate) {
//   if (type instanceof ApiBuilderPrimitiveType) {
//     return convertApiBuilderPrimitiveType(type);
//   }

//   if (type instanceof ApiBuilderArray) {
//     return convertApiBuilderArray(type, validate);
//   }

//   if (
//     type instanceof ApiBuilderModel ||
//     type instanceof ApiBuilderEnum ||
//     type instanceof ApiBuilderUnion) {
//     if (validate(type)) {
//       return convertBuilderTypeToReference(type);
//     }

//     throw new Error(`Apibuilder type ${type} not found`);
//   }
// }

// function generateSchemaFromUnion(union: ApiBuilderUnion, typeValidation): SchemaObject {
//   const types = map(union.types, t => t.type);
//   const unionTypes = map(types, t => convertApiBuilderType(t, typeValidation));
//   return {
//     [union.name]: {
//       ...union.description && { description:  union.description },
//       oneOf: unionTypes,
//     },
//   };
// }

// function generateSchemaUnions(service: ApiBuilderService): SchemaObject[] {
//   const typeValidation = typeValidator(service);
//   return map(service.unions, union => generateSchemaFromUnion(union, typeValidation));
// }

// function generateSchemaFromModel(model: ApiBuilderModel, modelValidator) {
//   const required = map(filter(model.fields, ['required', true]), req => req.name);
//   const properties = generateProperties(model.fields, modelValidator);

//   return {
//     [model.shortName]: {
//       description: model.description,
//       ...model.fields.length && { properties },
//       ...required.length && { required },
//       ...model.isDeprecated && { deprecated: model.isDeprecated },
//       ...model.fields.length && { type: 'object' },
//     },
//   };
// }

// function generateSchemaModels(service) {
//   const validator = typeValidator(service);
//   return map(service.models, model => generateSchemaFromModel(model, validator));
// }

// function generateComponentsObject(service) {
//   const schemaModels = generateSchemaModels(service);
//   const schemaEnums = generateSchemaEnums(service);
//   const schemaUnions = generateSchemaUnions(service);
//   const schemas = reduce(
//     [].concat(schemaModels, schemaEnums, schemaUnions),
//     (acc, value) => {
//       return Object.assign(acc, value);
//     },
//     {},
//    );
//   return {
//     schemas,
//   };
// }

// function generatePathsObject(service: ApiBuilderService): PathsObject {
//   const resourceOperations = extractApiBuilderOperations(service.resources);
//   const paths = mapValues(resourceOperations, (resourceOperation) => {
//     return reduce(
//       resourceOperation,
//       (resourcePaths, operation) => {
//         resourcePaths[operation.method.toLowerCase()] = generateOperationObject(operation);
//         return resourcePaths;
//       },
//       {},
//     );
//   });
//   return paths;
// }

// function generateInfoObject(service): InfoObject {
//   return {
//     contact: get(service, 'info.contact', {}),
//     description: service.description,
//     license: get(service, 'info.license', {}),
//     termsOfService: '',
//     title: service.name,
//     version: service.version,
//   };
// }

// const generateOpenApiSpec = (service: ApiBuilderService): OpenAPIObject => {
//   const openapi = '3.0.2';
//   const info = generateInfoObject(service);
//   const paths = generatePathsObject(service);
//   const components = generateComponentsObject(service);
//   return {
//     components,
//     info,
//     openapi,
//     paths,
//   };
// };
