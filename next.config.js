/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://wttr.in/:path*',
      },
    ]
  },
}

module.exports = nextConfig
