/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/forcefoundry' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/forcefoundry/' : '',
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000'],
}

module.exports = nextConfig
