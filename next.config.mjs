/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  // This is required for Next.js to work with standalone image components.
  // We will also configure the image domains for our placeholder images.
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
