import ejs from "ejs";
import { ApiBuilderFile, ApiBuilderInvocationFormConfig, ApiBuilderService, ApiBuilderModel, ApiBuilderType, isEnumType, isModelType, isArrayType, isMapType, isUnionType, ApiBuilderOperation } from "apibuilder-js";
import { capitalize, kebabCase } from "lodash";
import pascalCase from "../../utilities/pascalCase"

import fs = require('fs');
import path = require('path');
import prettier = require('prettier');

const fileHeader = [`import ComponentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import DataTypes from '@data-driven-forms/react-form-renderer/dist/cjs/data-types';
import ValidatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';

`];

const PrimitiveFieldTypes = ['decimal', 'double', 'integer', 'long', 'string', 'boolean', 'json', 'object', 'date-time-iso8601', 'date-iso8601', 'unit', 'uuid'];

const ComponentTypeMap = {
  'decimal': 'ComponentTypes.TEXT_FIELD',
  'double': 'ComponentTypes.TEXT_FIELD',
  'integer': 'ComponentTypes.TEXT_FIELD',
  'long': 'ComponentTypes.TEXT_FIELD',
  'string': 'ComponentTypes.TEXT_FIELD',
  'boolean': 'ComponentTypes.SWITCH',
  'json': 'ComponentTypes.TEXT_FIELD',
  'object': 'ComponentTypes.TEXT_FIELD',
  'date-time-iso8601': 'ComponentTypes.TEXT_FIELD',
  'date-iso8601': 'ComponentTypes.DATE_PICKER',
  'unit': 'ComponentTypes.TEXT_FIELD',
  'uuid': 'ComponentTypes.TEXT_FIELD',
};

const DataTypeMap = {
  'boolean': 'DataTypes.BOOLEAN',
  'decimal': 'DataTypes.NUMBER',
  'double': 'DataTypes.FLOAT',
  'integer': 'DataTypes.INTEGER',
  'long': 'DataTypes.INTEGER',
};

const TypeMap = {
  'boolean': 'boolean',
  'double': 'number',
  'decimal': 'number',
  'integer': 'number',
  'long': 'number',
};

function getFieldType(type: ApiBuilderType): string {
  if (PrimitiveFieldTypes.indexOf(type.toString()) > -1) {
    return 'primitiveField';
  }

  if (isArrayType(type)) {
    return 'arrayField';
  }

  if (isMapType(type)) {
    return 'mapField';
  }

  if (isEnumType(type)) {
    return 'enumField';
  }

  if (isModelType(type)) {
    return 'modelField';
  }

  if (isUnionType(type)) {
    return 'unionField';
  }

  return undefined;
}

function getComponentType(type: string): string {
  return ComponentTypeMap[type];
}

function getDataType(type: string): string {
  return DataTypeMap[type];
}

function getType(type: string): string {
  return TypeMap[type];
}

function makeLabel(value: string): string {
  return capitalize(value.replace(/_/g, ' '));
}

const helpers = {
  getFieldType,
  getComponentType,
  getDataType,
  getType,
  pascalCase,
  makeLabel
};

function generateSchema(model: ApiBuilderModel) {
  const templatePath = path.resolve(__dirname, './templates/schema.ejs');
  const template = fs.readFileSync(templatePath, 'utf8');
  const compiled = ejs.compile(template, { filename: templatePath });

  return compiled({ model, helpers });
}

function generateSchemas(service: ApiBuilderService): string[] {
  const models: ApiBuilderModel[] = [];
  const schemas = [];

  service.resources.forEach((resource) => {
    resource.operations.forEach((operation) => {
      const model = operation.body && operation.body.type && isModelType(operation.body.type) ? operation.body.type : undefined;

      if (model && (operation.method === 'PUT' || operation.method === 'POST')
        && models.findIndex((m) => m.shortName === model.shortName) < 0) {
        models.push(model);
      }
    });
  });

  models.forEach((model) => {
    schemas.push(generateSchema(model));
  });

  return schemas;
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return new Promise((resolve) => {
    const service = new ApiBuilderService(invocationForm.service);
    const schemas = generateSchemas(service);

    const codeFile = prettier.format(fileHeader.concat(schemas).join(''), {
      printWidth: 120,
      singleQuote: true,
      parser: 'typescript',
      useTabs: true,
    });

    resolve([new ApiBuilderFile(`${kebabCase(service.name.toLowerCase())}.ts`, 'data_driven_forms', codeFile)]);
  });
}
