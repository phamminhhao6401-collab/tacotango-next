/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tacotango.id.vn',
        port: '',
        pathname: '/images/**',
      },
    ],
  },
};

module.exports = nextConfig;