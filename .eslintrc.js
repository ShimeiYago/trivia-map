module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        trailingComma: 'all',
        endOfLine: 'lf',
        semi: true,
        singleQuote: true,
        printWidth: 100,
        tabWidth: 2,
      },
    ],
  },
  ignorePatterns: ['/build/', '/node_modules/'],
};
