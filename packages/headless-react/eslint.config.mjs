import baseConfig from '../../eslint.config.mjs';
import nx from '@nx/eslint-plugin';

export default [
  ...baseConfig,
  ...nx.configs['flat/react'],
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      'no-constant-binary-expression': 'off',
      'no-fallthrough': 'off',
      // Preserve the package's existing cart-to-form state synchronization.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
];
