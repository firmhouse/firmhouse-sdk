//@ts-check

const path = require('node:path');
const { composePlugins, withNx } = require('@nx/next');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname, '../../..'),
  transpilePackages: ['@firmhouse/firmhouse-sdk', '@firmhouse/ui-components'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3-eu-west-1.amazonaws.com',
        pathname: '/firmhouse-payments-production/**',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [
        {
          loader: require.resolve('@svgr/webpack'),
          options: {
            exportType: 'named',
            namedExport: 'ReactComponent',
            ref: true,
            svgo: false,
            titleProp: true,
          },
        },
      ],
    });

    return config;
  },
};

module.exports = composePlugins(withNx)(nextConfig);
