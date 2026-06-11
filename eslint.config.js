const tseslint = require('typescript-eslint');
const globals = require('globals');
const importX = require('eslint-plugin-import-x');

module.exports = tseslint.config(
  ...tseslint.configs.recommended,
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts'],
    plugins: { 'import-x': importX },
    languageOptions: {
      globals: globals.node,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname,
      },
    },
    settings: {
      'import-x/resolver': { typescript: { alwaysTryTypes: true } },
    },
    rules: {
      'no-unreachable': 'error',
      'no-restricted-imports': ['error', { paths: [] }],
      'import-x/no-cycle': 'error',
      '@typescript-eslint/no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
  {
    files: ['src/renderer/**/*.js'],
    plugins: { 'import-x': importX },
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-unreachable': 'error',
      'no-restricted-imports': ['error', { paths: [] }],
      'import-x/no-cycle': 'error',
      'no-unused-vars': 'warn',
    },
  },
);
