const FullyQualifiedType = require('./FullyQualifiedType');

const { get } = require('lodash');

const log = require('debug')('apibuilder:graphql');

function getResultType(operation) {
  return get(operation.responses.filter(r => r.code.integer.value >= 200 && r.code.integer.value < 300), '[0].type');
}

class Resource {
  constructor(schema, service) {
    Object.assign(this, schema);
    this.service = service;
    try {
      this.type = new FullyQualifiedType(schema.type);
    } catch (e) {
      this.type = new FullyQualifiedType(`${service.namespace}.${schema.type}`);
    }

    this.operations.forEach(op => op.responses.forEach((res) => {
      try {
        res.type = new FullyQualifiedType(res.type);
      } catch (e) {
        res.type = new FullyQualifiedType(FullyQualifiedType.mapType(res.type, t => `${service.namespace}.${t}`));
      }
    }));

    log('resource:', this.type.fullyQualifiedType);
    log('path', this.path);
    for (const op of this.operations) {
      if (op.path.startsWith(this.path)) {
        op.path = op.path.substring(this.path.length);
      }
      const res = getResultType(op);
      if (op.method === 'GET' && res) { // getters
        if (res.fullyQualifiedType === this.type.fullyQualifiedType) {
          log(`▶️   get one at ${this.path}${op.path}`);
        } else if (res.fullyQualifiedName === this.type.fullyQualifiedType) {
          log(`▶️   query all at ${this.path}${op.path}`);
        } else {
          const parts = op.path.split('/').filter(x => x.length > 0 && x[0] != ':');
          if (parts.length > 0) {
            log(`▶️   get ${this.type.fullyQualifiedType} ${parts.join('-')} at ${this.path}${op.path}`);
          } else {
            log(`❌   unknown ${this.path}${op.path}`);
          }
        }
      }

      if (!res) {
        log(op);
      }
      // log(op);
      // log('\n');
    }
    log('\n');
  }
}

module.exports = Resource;
