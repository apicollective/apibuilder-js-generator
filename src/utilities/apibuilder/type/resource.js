const {
  FullyQualifiedType,
  mapType
} = require('../utilities');

const {
  get,
  camelCase
} = require('lodash');

const log = require('debug')('apibuilder:graphql');

function getResultType(operation) {
  return get(
    operation.responses.filter(r => r.code.integer.value >= 200 && r.code.integer.value < 300), // find 2xx code
    '[0].type',
    'unit'
  );
}

class ApiBuilderResource {
  constructor(schema, service) {
    Object.assign(this, schema);
    this.service = service;

    try {
      this.type = new FullyQualifiedType(schema.type);
    } catch (e) {
      this.type = new FullyQualifiedType(`${service.namespace}.${schema.type}`);
    }

    for (const op of this.operations) {
      // remove path prefix
      if (op.path.startsWith(this.path)) {
        op.path = op.path.substring(this.path.length);
      }

      // parse result type
      try {
        op.resultType = new FullyQualifiedType(getResultType(op));
      } catch (e) {
        op.resultType = new FullyQualifiedType(mapType(getResultType(op), t => `${service.namespace}.${t}`));
      }

      // parse response types
      for (const res of op.responses) {
        try {
          res.type = new FullyQualifiedType(res.type);
        } catch (e) {
          res.type = new FullyQualifiedType(mapType(res.type, t => `${service.namespace}.${t}`));
        }
      }
    }

    log('resource:', this.type.fullyQualifiedType);
    log('path', this.path);

    // const findOne = this.operations
    //   .filter(op => op.method === 'GET')
    //   .filter(op => op.resultType.fullyQualifiedName === this.type.fullyQualifiedType)
    //   .sort((a, b) => {
    //     if (a.path === '' && b.path === '') return 0;
    //     else if (a.path === '') return 1;
    //     else if (b.path === '') return -1;
    //     else return 0;
    //   });

    // if (typeof findOne !== 'undefined') {
    //   log(`🔥  Get One = ${this.path}[${findOne.map(x => x.path)}]`)
    // } else {
    //   log(`🔥  no getOne`);
    // }

    const strOrVersion = (str) => new RegExp(`^${str}(?:_v\\d+)?$`)

    let one = 0;
    let all = 0;
    for (const op of this.operations) {
      const res = op.resultType;
      if (op.method === 'GET') { // getters
        // console.log(`"${res.fullyQualifiedType}" matches ${strOrVersion(this.type.fullyQualifiedType)} ?`);
        // console.log(`"${res.baseType}" matches ${strOrVersion(this.type.fullyQualifiedType)} ?`);
        if (res.fullyQualifiedType.match(strOrVersion(this.type.fullyQualifiedType))) {
          log(`▶️   get one (${res.fullyQualifiedType}) at ${this.path}${op.path}`);
        } else if (res.baseType.match(strOrVersion(this.type.fullyQualifiedType))) {
          log(`▶️   get all (${res.fullyQualifiedType}) at ${this.path}${op.path}`);
        } else {
          const parts = op.path.split('/').filter(x => x.length > 0 && x[0] != ':');
          if (parts.length > 0) {
            log(`▶️   get ${this.type.fullyQualifiedType}'s ${parts.join('-')} at ${this.path}${op.path} => ${res.fullyQualifiedType}`);
          } else {
            log(`❌   unknown ${this.path}${op.path} => ${res.fullyQualifiedType}`);
          }
        }
      }
      // log(op);
      // log('\n');
    }
    log('\n');
  }
}

exports.ApiBuilderResource = ApiBuilderResource;
