import {
  ApiBuilderArray,
  ApiBuilderEnum,
  ApiBuilderFile,
  ApiBuilderInvocationFormConfig,
  ApiBuilderMap,
  ApiBuilderModel,
  ApiBuilderPrimitiveType,
  ApiBuilderType,
  ApiBuilderUnion,
  isArrayType,
  isEnumType,
  isMapType,
  isModelType,
  isPrimitiveType,
  isUnionType,
} from 'apibuilder-js';
import { builders as b, namedTypes } from 'ast-types';
import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';
import { print } from 'recast';
import { buildContext, buildTypeAnnotation, Context } from '../../builders';
import { checkIdentifier } from '../../utilities/language';

function buildPropertyKey(value: string) {
  const feedback = checkIdentifier(value);
  return feedback.needsQuotes ? b.stringLiteral(value) : b.identifier(value);
}

function buildObjectOfHelperCallExpression(type: ApiBuilderMap) {
  return b.callExpression(
    b.memberExpression(
      b.identifier('helpers'),
      b.identifier('objectOf'),
    ),
    [b.arrowFunctionExpression([], buildFactoryCallExpression(type.ofType))],
  );
}

function buildArrayOfHelperCallExpression(type: ApiBuilderArray) {
  return b.callExpression(
    b.memberExpression(
      b.identifier('helpers'),
      b.identifier('arrayOf'),
    ),
    [b.arrowFunctionExpression([], buildFactoryCallExpression(type.ofType))],
  );
}

function buildFakerCallExpression(object: string, property: string) {
  return b.callExpression(
    b.memberExpression(
      b.memberExpression(
        b.identifier('faker'),
        b.identifier(object),
      ),
      b.identifier(property),
    ),
    [],
  );
}

function buildFactoryCallMemberExpression(
  type: ApiBuilderPrimitiveType | ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
) {
  if (isPrimitiveType(type)) {
    return b.memberExpression(
      b.identifier('factories'),
      b.identifier(snakeCase(type.typeName)),
    );
  }

  const feedback = checkIdentifier(type.fullName);
  return b.memberExpression.from({
    computed: feedback.needsQuotes,
    object: b.identifier('factories'),
    property: feedback.needsQuotes ? b.stringLiteral(type.fullName) : b.identifier(type.fullName),
  });
}

function buildFactoryCallExpression(type: ApiBuilderType) {
  if (isMapType(type)) {
    return buildObjectOfHelperCallExpression(type);
  }

  if (isArrayType(type)) {
    return buildArrayOfHelperCallExpression(type);
  }

  return b.callExpression(
    buildFactoryCallMemberExpression(type),
    [],
  );
}

function buildFakerFactory(object: string, property: string) {
  return b.arrowFunctionExpression([], buildFakerCallExpression(object, property));
}

function buildArrayOfHelper() {
  return b.arrowFunctionExpression.from({
    body: b.blockStatement([
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('length'),
          b.numericLiteral(3),
        ),
      ]),
      b.returnStatement(
        b.callExpression(
          b.memberExpression(
            b.identifier('Array'),
            b.identifier('from'),
          ),
          [
            b.objectExpression([
              b.property.from({
                key: b.identifier('length'),
                kind: 'init',
                shorthand: true,
                value: b.identifier('length'),
              }),
            ]),
            b.identifier('f'),
          ],
        ),
      ),
    ]),
    params: [
      b.identifier.from({
        name: 'f',
        typeAnnotation: b.typeAnnotation(
          b.functionTypeAnnotation(
            [],
            b.genericTypeAnnotation(b.identifier('T'), null),
            null,
            null,
          ),
        ),
      }),
    ],
    typeParameters: b.typeParameterDeclaration([
      b.typeParameter('T'),
    ]),
  });
}

function buildBooleanFactory() {
  return buildFakerFactory('datatype', 'boolean');
}

function buildDateFactory() {
  return b.arrowFunctionExpression([], b.callExpression(
    b.memberExpression(
      b.callExpression(
        b.memberExpression(
          buildFakerCallExpression('datatype', 'datetime'),
          b.identifier('toISOString'),
        ),
        [],
      ),
      b.identifier('slice'),
    ),
    [b.numericLiteral(0), b.numericLiteral(10)],
  ));
}

function buildDateTimeFactory() {
  return b.arrowFunctionExpression([], b.callExpression(
    b.memberExpression(
      buildFakerCallExpression('datatype', 'datetime'),
      b.identifier('toISOString'),
    ),
    [],
  ));
}

function buildFloatFactory() {
  return buildFakerFactory('datatype', 'float');
}

function buildJsonObjectFactory() {
  return buildFakerFactory('datatype', 'json');
}

function buildNumberFactory() {
  return buildFakerFactory('datatype', 'number');
}

function buildObjectOfHelper() {
  return b.arrowFunctionExpression.from({
    body: b.blockStatement([
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('keys'),
          b.arrayExpression([
            b.stringLiteral('foo'),
            b.stringLiteral('bar'),
            b.stringLiteral('qux'),
          ]),
        ),
      ]),
      b.returnStatement(
        b.callExpression(
          b.memberExpression(
            b.identifier('keys'),
            b.identifier('reduce'),
          ),
          [
            b.arrowFunctionExpression(
              [b.identifier('object'), b.identifier('key')],
              b.blockStatement([
                b.expressionStatement(
                  b.assignmentExpression(
                    '=',
                    b.memberExpression.from({
                      computed: true,
                      object: b.identifier('object'),
                      property: b.identifier('key'),
                    }),
                    b.callExpression(b.identifier('f'), []),
                  ),
                ),
                b.returnStatement(b.identifier('object')),
              ]),
            ),
            b.objectExpression([]),
          ],
        ),
      ),
    ]),
    params: [
      b.identifier.from({
        name: 'f',
        typeAnnotation: b.typeAnnotation(
          b.functionTypeAnnotation(
            [],
            b.genericTypeAnnotation(b.identifier('T'), null),
            null,
            null,
          ),
        ),
      }),
    ],
    typeParameters: b.typeParameterDeclaration([
      b.typeParameter('T'),
    ]),
  });
}

function buildStringFactory() {
  return buildFakerFactory('datatype', 'string');
}

function buildUnitFactory() {
  return b.arrowFunctionExpression([], b.identifier('undefined'));
}

function buildUuidFactory() {
  return buildFakerFactory('datatype', 'uuid');
}

function buildPlaceholderFactory() {
  return b.arrowFunctionExpression.from({
    body: b.blockStatement([
      b.throwStatement(b.newExpression(b.identifier('Error'), [
        b.stringLiteral('Not Implemented'),
      ])),
    ]),
    params: [],
  });
}

function buildEnumFactory(type: ApiBuilderEnum, context: Context) {
  const elements = type.values.map(value => b.stringLiteral(value.name));
  return b.arrowFunctionExpression.from({
    body: b.callExpression(
      b.memberExpression(
        b.memberExpression(b.identifier('faker'), b.identifier('random')),
        b.identifier('arrayElement'),
      ),
      [b.arrayExpression(elements)],
    ),
    params: [],
    returnType: buildTypeAnnotation(type, context),
  });
}

function buildModelFactory(model: ApiBuilderModel, context: Context) {
  const properties = model.fields.map((field) => {
    return b.objectProperty(
      buildPropertyKey(field.name),
      buildFactoryCallExpression(field.type),
    );
  });

  if (model.discriminator != null && model.discriminatorValue != null) {
    properties.unshift(b.objectProperty(
      buildPropertyKey(model.discriminator),
      b.stringLiteral(model.discriminatorValue),
    ));
  }

  return b.arrowFunctionExpression.from({
    body: b.objectExpression(properties),
    params: [],
    returnType: buildTypeAnnotation(model, context),
  });
}

function buildUnionFactory(
  union: ApiBuilderUnion,
  context: Context,
) {
  const factories = union.types.map((_) => {
    if (isPrimitiveType(_.type) || isEnumType(_.type)) {
      return b.arrowFunctionExpression([], b.objectExpression([
        b.objectProperty(
          buildPropertyKey(union.discriminator),
          b.tsAsExpression(
            b.stringLiteral(_.discriminatorValue),
            b.tsTypeReference(b.identifier('const')),
          ),
        ),
        b.objectProperty(buildPropertyKey('value'), buildFactoryCallExpression(_.type)),
      ]));
    }

    return b.arrowFunctionExpression([], buildFactoryCallExpression(_.type));
  });
  return b.arrowFunctionExpression.from({
    body: b.blockStatement([
      b.variableDeclaration('const', [
        b.variableDeclarator(
          b.identifier('f'),
          b.callExpression(
            b.memberExpression(
              b.memberExpression(b.identifier('faker'), b.identifier('random')),
              b.identifier('arrayElement'),
            ),
            [b.arrayExpression(factories)],
          ),
        ),
      ]),
      b.returnStatement(
        b.callExpression(b.identifier('f'), []),
      ),
    ]),
    params: [],
    returnType: buildTypeAnnotation(union, context),
  });
}

function buildFactory(
  type: ApiBuilderType,
  context: Context,
) {
  if (isEnumType(type)) return buildEnumFactory(type, context);
  if (isModelType(type)) return buildModelFactory(type, context);
  if (isUnionType(type)) return buildUnionFactory(type, context);
  return buildPlaceholderFactory();
}

function buildHelpersObject() {
  return b.variableDeclaration('const', [
    b.variableDeclarator(
      b.identifier('helpers'),
      b.objectExpression([
        b.objectProperty(b.identifier('arrayOf'), buildArrayOfHelper()),
        b.objectProperty(b.identifier('objectOf'), buildObjectOfHelper()),
      ]),
    ),
  ]);
}

function buildFactoriesObject(context: Context) {
  // TODO: Only generate the primitive factories needed to support the service.
  const primitives = [
    b.objectProperty(b.identifier('boolean'), buildBooleanFactory()),
    b.objectProperty(b.identifier('date_iso_8601'), buildDateFactory()),
    b.objectProperty(b.identifier('date_time_iso_8601'), buildDateTimeFactory()),
    b.objectProperty(b.identifier('decimal'), buildFloatFactory()),
    b.objectProperty(b.identifier('double'), buildFloatFactory()),
    b.objectProperty(b.identifier('integer'), buildNumberFactory()),
    b.objectProperty(b.identifier('json'), buildJsonObjectFactory()),
    b.objectProperty(b.identifier('long'), buildNumberFactory()),
    b.objectProperty(b.identifier('object'), buildJsonObjectFactory()),
    b.objectProperty(b.identifier('string'), buildStringFactory()),
    b.objectProperty(b.identifier('unit'), buildUnitFactory()),
    b.objectProperty(b.identifier('uuid'), buildUuidFactory()),
  ];

  const types = context.sortedTypes.sort().map((typeName) => {
    return b.objectProperty(
      b.stringLiteral(typeName),
      buildFactory(context.typesByName[typeName], context),
    );
  });

  return b.variableDeclaration('const', [
    b.variableDeclarator(
      b.identifier('factories'),
      b.objectExpression([
        ...primitives,
        ...types,
      ]),
    ),
  ]);
}

function buildExternalFactory(
  type: ApiBuilderEnum | ApiBuilderModel | ApiBuilderUnion,
) {
  const factoryName = camelCase(`make_${type.shortName}`);
  return b.exportNamedDeclaration(
    b.variableDeclaration('const', [
      b.variableDeclarator(
        b.identifier(factoryName),
        b.arrowFunctionExpression([], buildFactoryCallExpression(type)),
      ),
    ]),
  );
}

function buildFile(context: Context): namedTypes.File {
  return b.file.from({
    program: b.program.from({
      body: [
        b.importDeclaration([
          b.importDefaultSpecifier(b.identifier('faker')),
        ],                  b.stringLiteral('@faker-js/faker')),
        buildHelpersObject(),
        buildFactoriesObject(context),
        ...context.rootService.enums.map(buildExternalFactory),
        ...context.rootService.models.map(buildExternalFactory),
        ...context.rootService.unions.map(buildExternalFactory),
      ],
    }),
  });
}

export function generate(
  invocationForm: ApiBuilderInvocationFormConfig,
): Promise<ApiBuilderFile[]> {
  return new Promise((resolve, reject) => {
    const files: ApiBuilderFile[] = [];
    const context = buildContext(invocationForm);
    const ast = buildFile(context);
    const basename = `${context.rootService.applicationKey}.ts`;
    const dirname = '';

    const { code } = print(ast, {
      quote: 'single',
      tabWidth: 2,
      trailingComma: true,
      useTabs: false,
    });

    const file = new ApiBuilderFile(basename, dirname, code);

    files.push(file);

    resolve(files);
  });
}
