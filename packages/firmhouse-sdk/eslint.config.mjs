import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';
import eslintPluginTsdoc from 'eslint-plugin-tsdoc';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  { plugins: { 'eslint-plugin-tsdoc': eslintPluginTsdoc } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    // Override or add rules here
    rules: {},
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    // Override or add rules here
    rules: {},
  },
];
