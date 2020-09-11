import {
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderModel,
  ApiBuilderService,
  ApiBuilderType,
  isArrayType,
  isEnumType,
  isMapType,
  isModelType,
  isUnionType,
} from 'apibuilder-js';
import ejs from 'ejs';
import { capitalize, kebabCase } from 'lodash';
import pascalCase from '../../utilities/pascalCase';

import fs = require('fs');
import path = require('path');
import prettier = require('prettier');

const fileHeader = [`import ComponentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import DataTypes from '@data-driven-forms/react-form-renderer/dist/cjs/data-types';
import ValidatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import Schema from '@data-driven-forms/react-form-renderer/dist/cjs/schema';

`];

const primitiveFieldTypes = [
  'decimal',
  'double',
  'integer',
  'long',
  'string',
  'boolean',
  'json',
  'object',
  'date-time-iso8601',
  'date-iso8601',
  'unit',
  'uuid',
];

const componentTypeMap = {
  boolean: 'ComponentTypes.SWITCH',
  'date-iso8601': 'ComponentTypes.DATE_PICKER',
  'date-time-iso8601': 'ComponentTypes.TEXT_FIELD',
  decimal: 'ComponentTypes.TEXT_FIELD',
  double: 'ComponentTypes.TEXT_FIELD',
  integer: 'ComponentTypes.TEXT_FIELD',
  json: 'ComponentTypes.TEXT_FIELD',
  long: 'ComponentTypes.TEXT_FIELD',
  object: 'ComponentTypes.TEXT_FIELD',
  string: 'ComponentTypes.TEXT_FIELD',
  unit: 'ComponentTypes.TEXT_FIELD',
  uuid: 'ComponentTypes.TEXT_FIELD',
};

const dataTypeMap = {
  boolean: 'DataTypes.BOOLEAN',
  decimal: 'DataTypes.NUMBER',
  double: 'DataTypes.FLOAT',
  integer: 'DataTypes.INTEGER',
  long: 'DataTypes.INTEGER',
};

const typeMap = {
  boolean: 'boolean',
  decimal: 'number',
  double: 'number',
  integer: 'number',
  long: 'number',
};

function getFieldType(type: ApiBuilderType): string {
  if (primitiveFieldTypes.indexOf(type.toString()) > -1) {
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
  return componentTypeMap[type];
}

function getDataType(type: string): string {
  return dataTypeMap[type];
}

function getType(type: string): string {
  return typeMap[type];
}

function makeLabel(value: string): string {
  return capitalize(value.replace(/_/g, ' '));
}

const helpers = {
  getComponentType,
  getDataType,
  getFieldType,
  getType,
  makeLabel,
  pascalCase,
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
      const model = operation.body
        && operation.body.type
        && isModelType(operation.body.type) ? operation.body.type : undefined;

      if (model && (operation.method === 'PUT' || operation.method === 'POST')
        && models.findIndex(m => m.shortName === model.shortName) < 0) {
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
    const fileName = `${kebabCase(service.name.toLowerCase())}.ts`;

    const codeFile = prettier.format(fileHeader.concat(schemas).join(''), {
      parser: 'typescript',
      printWidth: 120,
      singleQuote: true,
    });

    resolve([
      new ApiBuilderFile(fileName, 'data_driven_forms', codeFile),
    ]);
  });
}
