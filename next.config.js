/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // GitHub Pages deployment configuration
  basePath: '/forcefoundry',
  assetPrefix: '/forcefoundry/',
}

module.exports = nextConfig
