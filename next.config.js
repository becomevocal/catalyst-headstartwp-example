// @ts-check
const withMakeswift = require('@makeswift/runtime/next/plugin')();

const { withHeadstartWPConfig } = require('@headstartwp/next/config');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        hostname: process.env.BIGCOMMERCE_CDN_HOSTNAME ?? '*.bigcommerce.com',
      },
    ],
  },
  transpilePackages: ['@bigcommerce/components'],
  typescript: {
    ignoreBuildErrors: !!process.env.CI,
  },
  eslint: {
    ignoreDuringBuilds: !!process.env.CI,
    dirs: ['app', 'client', 'components', 'lib', 'middlewares'],
  },
  // default URL generation in BigCommerce uses trailing slash
  trailingSlash: process.env.TRAILING_SLASH !== 'false',
};

module.exports = withHeadstartWPConfig(withMakeswift(nextConfig));
