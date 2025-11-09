/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dvvjkgh94f2v6.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.rets.ly',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.rets.ly',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
