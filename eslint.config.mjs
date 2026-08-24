import nx from '@nx/eslint-plugin';
import globals from 'globals';

export default [
  ...nx.configs['flat/base'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    files: ['**/*.test.ts', '**/*.test.tsx', '**/*.test.js', '**/*.test.jsx'],
    languageOptions: {
      globals: globals.jest,
    },
  },
  {
    ignores: [
      '**/*.json',
      '**/*.generated.ts',
      '**/.next/**',
      '**/next-env.d.ts',
    ],
  },
];
