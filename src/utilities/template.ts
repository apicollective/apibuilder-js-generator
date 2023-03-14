/* eslint-disable import/prefer-default-export */
import fs from 'fs';
import ejs from 'ejs';
import prettier from 'prettier';

type Options = {
  prettier?: false | {
    parser?: 'babylon';
    singleQuote?: boolean;
    trailingComma?: 'es5' | 'all';
  };
};

const defaultOptions: Options = {
  prettier: {
    singleQuote: true,
    trailingComma: 'es5',
    parser: 'babylon',
  },
};

export function renderTemplate(filepath: string, data: ejs.Data, options = defaultOptions): string {
  const template = fs.readFileSync(filepath, 'utf8');
  const compiled = ejs.compile(template, { filename: filepath });
  const code = compiled(data);
  return options.prettier === false ? code : prettier.format(code, options.prettier);
}
