/** @type {import('next').NextConfig} */
// eslint-disable-next-line
require('dotenv').config()

const nextConfig = {
  output: 'export',
  env: {
    FAUNA_KEY: process.env.FAUNA_KEY,
    HUDDLE_PROJECT_ID: process.env.HUDDLE_PROJECT_ID,
    HUDDLE_KEY: process.env.HUDDLE_KEY,
  },
  transpilePackages: ['@lens-protocol'],
  images: {
    domains: ['ik.imagekit.io'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    return config
  },
  compiler: {
    removeConsole: false,
  },
}

module.exports = nextConfig
