import baseConfig from '../../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';
import nextVitals from 'eslint-config-next/core-web-vitals';
import globals from 'globals';

export default [
  ...baseConfig,
  ...nx.configs['flat/react-typescript'],
  ...nextVitals,
  {
    files: ['**/*.*'],
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@next/next/no-html-link-for-pages': [
        'error',
        'examples/nextjs/self-service-center/app',
      ],
      // Newly enabled by typescript-eslint v8; not enforced before the upgrade.
      '@typescript-eslint/ban-ts-comment': 'off',
    },
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
  {
    files: ['**/*.spec.ts', '**/*.spec.tsx', '**/*.spec.js', '**/*.spec.jsx'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    ignores: ['.next/**/*', 'next-env.d.ts'],
  },
];
