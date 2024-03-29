const babel = require('babel-core');
const es6Generate = require('../node_5_es6');

function generate(invocationForm) {
  return es6Generate.generate(invocationForm)
    .then((files) => files.map((file) => {
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
        return { ...file, contents };
      }
      return file;
    }));
}

module.exports = { generate };
