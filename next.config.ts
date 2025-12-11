import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  experimental: {
    viewTransition: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com'
      },
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io'
      },
      {
        protocol: 'https',
        hostname: 'imagekit.io'
      },
      {
        protocol: 'http',
        hostname: 'localhost'
      },
      {
        protocol: 'http',
        hostname: '192.168.0.171'
      }
    ],
    formats: ['image/avif', 'image/webp']
  }
}

export default nextConfig
