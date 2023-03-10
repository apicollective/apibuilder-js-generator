module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  ignorePatterns: [
    'dist/**/*',
    'generated/**/*',
    'user-generated/**/*',
  ],
  env: {
    browser: true,
    jest: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
  ],
  rules: {
    'import/extensions': ['error', 'ignorePackages', {
      ts: 'never',
      js: 'never',
      tsx: 'never',
      jsx: 'never',
    }],
    'import/no-extraneous-dependencies': ['error', {
      devDependencies: [
        '.eslintrc.js',
        'scripts/**/*',
        'test/**/*',
      ],
    }],
  },
  overrides: [{
    // TypeScript
    files: ['*.ts', '*.tsx', '*.d.ts'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: 'tsconfig.json',
      sourceType: 'module',
    },
    extends: [
      'airbnb-typescript-base',
      'plugin:import/errors',
      'plugin:import/warnings',
      'plugin:import/typescript',
    ],
    rules: {
      'no-undef': 'off',
      'no-var': 'off',
      'vars-on-top': 'off',
      '@typescript-eslint/explicit-function-return-type': ['error', {
        allowExpressions: true,
      }],
      'import/no-cycle': 'warn',
      // To much JS intermingled with TS causing these issues. TODO, convert to TS.
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  }],
};
