import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
 output: 'standalone',
 images: {
  remotePatterns: [
   {
    protocol: 'https',
    hostname: 'example.com',
   },
   {
    protocol: 'https',
    hostname: 'api.accounts.curlware.net',
   },
   {
    protocol: 'http',
    hostname: 'localhost',
   },
   {
    protocol: 'http',
    hostname: '192.168.0.171',
   },
  ],
  formats: ['image/avif', 'image/webp'],
 },
}

export default nextConfig
