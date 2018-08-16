import _ = require('lodash'); // tslint:disable-line:import-name
import {
  ApiBuilderFile,
  ApiBuilderService,
  ApiBuilderType,
  astFromType,
  getBaseType,
  IAst,
  isArrayType,
  isEnumType,
  Kind,
  typeNameFromAst,
} from '../../utilities/apibuilder';

function genResources(service: ApiBuilderService) {
  const ops = _.chain(service.resources)
    .flatMap(res => res.operations)
    .filter(op => op.method === 'GET')
    .groupBy(op => getBaseType(op.resultType).shortName)
    .value();
    // .mapValues(ops => ops.map(value => value.config))
    // .value();

  // tslint:disable:object-literal-sort-keys
  const result = {};
  for (const [resource, operations] of Object.entries(ops)) {
    const [[many], [one]] = _.partition(operations, op => isArrayType(op.resultType))
    const op = many || one;
    result[resource] = {
      [many != null ? 'many' : 'one']: {
        path: op.resourcePath + op.path,
        params: _.fromPairs(op.arguments.map((arg) => {
          const type = typeToString(arg.type);
          const param: {
            type: string,
            required: boolean,
            default?: any,
          } = {
            type,
            required: arg.required,
          };
          if (arg.defaultValue !== undefined) {
            if (type === 'integer' || type === 'long') {
              param.default = parseInt(arg.defaultValue, 10);
            } else if (type === 'double') {
              param.default = parseFloat(arg.defaultValue);
            }
          }

          return [arg.name, param];
        })),
      },
    };
  }
  // tslint:enable:object-literal-sort-keys
  return result;
}

function keyByProp<T extends object, K extends keyof T>(objs: T[], key: K):
{
  [key: string]: {
    [P in Exclude<keyof T, K>]: T[P]
  },
} {
  return _.mapValues(_.keyBy(objs, key), (value: T) => _.omit(value, key));
}

function renameTypes(ast: IAst): IAst {
  if (ast.name === Kind.MAP || ast.name === Kind.ARRAY) {
    return {
      name: ast.name,
      type: renameTypes(ast.type),
    };
  }

  if (ast.name === 'decimal') {
    return { name: 'double' };
  }

  return ast;
}

function typeToString(type: ApiBuilderType) {
  const ast = renameTypes(astFromType(type));
  return typeNameFromAst(ast);
}

export function generate({ service: data }) {
  const service = new ApiBuilderService({ service: data });

  // tslint:disable:object-literal-sort-keys
  const enums = service.enums.map(enm => ({
    name: enm.shortName,
    values: enm.values.map(value => ({
      name: value.name,
      description: value.description,
    })),
  }));

  const models = service.models.map(model => ({
    name: model.shortName,
    description: model.description,
    fields: model.fields.map(field => ({
      name: field.name,
      type: typeToString(field.type),
      description: field.description,
    })),
  }));

  const enumWrappers: Array<{type: string}> = [];

  const unions = service.unions.map(union => ({
    name: union.shortName,
    description: union.description,
    types: union.types.map((unionType) => {
      const str = typeToString(unionType.type);
      if (isEnumType(unionType.type)) {
        enumWrappers.push({
          type: str,
        });
        return { name: `${str}_wrapper` };
      }

      return { name: str };
    }),
  }));

  for (const { type } of enumWrappers) {
    models.push({
      name: `${type}_wrapper`,
      description: `Wrapper for ${type} so that it can be in an enum`,
      fields: [
        {
          type,
          name: 'value',
          description: 'The enum value',
        },
      ],
    });
  }

  const contents = {
    base_url: service.baseUrl,
    enums: keyByProp(enums, 'name'),
    models: keyByProp(models, 'name'),
    unions: keyByProp(unions, 'name'),
    resources: genResources(service),
  };
  // tslint:enable:object-literal-sort-keys

  return Promise.resolve([
    new ApiBuilderFile('config.json', '', JSON.stringify(contents)),
  ]);
}
