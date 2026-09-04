const path = require('node:path');
const autoprefixer = require('autoprefixer');

const nxRollupRoot = path.dirname(require.resolve('@nx/rollup/package.json'));
const { postcss } = require(
  path.join(nxRollupRoot, 'dist/src/plugins/postcss'),
);

module.exports = (config, options) => ({
  ...config,
  plugins: [
    ...config.plugins.filter((plugin) => plugin.name !== 'postcss'),
    postcss({
      autoModules: true,
      extract: options.extractCss,
      include: /\.css$/,
      inject: true,
      plugins: [autoprefixer],
    }),
  ],
});
