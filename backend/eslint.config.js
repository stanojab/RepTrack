import js from '@eslint/js';
import globals from 'globals';

export default [
  { ignores: ['node_modules/', 'coverage/'] },
  js.configs.recommended,
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.node },
    },
    rules: {
      // Express error handlers need the unused "next" argument
      'no-unused-vars': ['error', { argsIgnorePattern: '^(next|_)' }],
    },
  },
];
