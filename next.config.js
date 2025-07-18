/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages deployment configuration
  basePath: process.env.NODE_ENV === 'production' ? '/forcefoundry' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/forcefoundry/' : '',
}

module.exports = nextConfig
