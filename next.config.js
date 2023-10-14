/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"], // Use * para permitir imagens de qualquer domínio
  },
};

module.exports = nextConfig;
