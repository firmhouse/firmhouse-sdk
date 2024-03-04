const replace = require('@rollup/plugin-replace');
module.exports = (config) => {
  return {
    ...config,
    plugins: [
      replace({
        preventAssignment: true,
        delimiters: ['', ''],
        values: {
          // Remove cross-fetch from the bundle to clear node.js dependencies and use the native fetch
          fetch$1: 'fetch',
          CrossFetch__default: 'fetch',
          'CrossFetch.Headers': 'Headers',
          crossFetch: 'fetch',
          'CrossFetch &&': '',
          "var fetch = require('cross-fetch');":
            'var fetch = globalThis.fetch;',
          "import fetch from 'cross-fetch';": 'const fetch = globalThis.fetch;',
        },
      }),
      ...config.plugins,
    ],
  };
};
