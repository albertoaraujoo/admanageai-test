import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Avoid production failures on /_next/image (e.g. 402 from optimization pipeline).
    // External image URLs are loaded directly.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'api.nanobananaapi.ai',
      },
      {
        protocol: 'https',
        hostname: '**.nanobananaapi.ai',
      },
      {
        protocol: 'https',
        hostname: 'tempfile.aiquickdraw.com',
      },
      {
        protocol: 'https',
        hostname: '**.aiquickdraw.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'lh4.googleusercontent.com',
      },
    ],
  },
}

export default nextConfig
