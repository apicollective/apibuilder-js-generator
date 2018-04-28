const babel = require('babel-core');
const es6Generate = require('../node_5_es6');

function generate(service) {
  return es6Generate.generate(service)
    .then(files => files.map((file) => {
      if (file.name.endsWith('.js')) {
        const contents = babel.transform(
          file.contents,
          {
            presets: [
              ['env', {
                browsers: ['last 2 versions', 'ie >= 7'],
              }],
            ],
          },
        ).code;
        return Object.assign({}, file, { contents });
      }
      return file;
    }));
}

module.exports = { generate };
