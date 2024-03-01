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
          "import * as CrossFetch from 'cross-fetch';": '',
          "import CrossFetch__default from 'cross-fetch';": '',
          "import fetch$1 from 'cross-fetch';": '',
          fetch$1: 'fetch',
          CrossFetch__default: 'fetch',
          'CrossFetch.Headers': 'Headers',
          crossFetch: 'fetch',
          'CrossFetch &&': '',
        },
      }),
      ...config.plugins,
    ],
  };
};
