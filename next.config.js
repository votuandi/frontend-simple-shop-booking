/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config");
const nextConfig = {
  // reactStrictMode: true,
  i18n,
  productionBrowserSourceMaps: true,

  reactStrictMode: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      resourceQuery: { not: [/url/] },
      use: ["@svgr/webpack", "url-loader"],
    });

    return config;
  },
}

module.exports = nextConfig
