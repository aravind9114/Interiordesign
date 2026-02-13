/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
        pathname: "/generated/**",
      },
    ],
  },
};

module.exports = nextConfig;
