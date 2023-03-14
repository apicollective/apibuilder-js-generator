import { SchemaObject } from '@loopback/openapi-v3-types';
import {
  ApiBuilderField, isArrayType, isPrimitiveType, Kind,
} from 'apibuilder-js';
import { reduce } from 'lodash';
import { convertApiBuilderType } from '../openapi-utils';
import { IsImportedChecker } from '../openapi-utils/isTypeImported';

function getMinAndMax(field: ApiBuilderField): SchemaObject {
  if (isPrimitiveType(field.type)) {
    if (field.type.baseTypeName === Kind.DECIMAL
      || field.type.baseTypeName === Kind.DOUBLE
      || field.type.baseTypeName === Kind.INTEGER
      || field.type.baseTypeName === Kind.LONG) {
      return {
        ...field.minimum && { minimum: field.minimum },
        ...field.maximum && { maximum: field.maximum },
      };
    }

    if (field.type.baseTypeName === Kind.STRING
      || field.type.baseTypeName === Kind.UUID) {
      return {
        ...field.minimum && { minLength: field.minimum },
        ...field.maximum && { maxLength: field.maximum },
      };
    }
  }

  if (isArrayType(field.type)) {
    return {
      ...field.minimum && { minItems: field.minimum },
      ...field.maximum && { maxItems: field.maximum },
    };
  }

  return {};
}

function generateSchemaPropertiesFromModelFields(
  fields: ApiBuilderField[],
  validate,
  isImported: IsImportedChecker,
): Record<string, SchemaObject> {
  return reduce(
    fields,
    (acc, value) => {
      acc[value.name] = {
        ...convertApiBuilderType(value.type, validate, isImported),
        ...value.description && { description: value.description },
        ...value.default && { default: value.default },
        ...value.isDeprecated && { deprecated: true },
        ...value.example && { example: value.example },
        ...getMinAndMax(value),
      };
      return acc;
    },
    {} as { [key: string]: SchemaObject },
  );
}

export default generateSchemaPropertiesFromModelFields;
