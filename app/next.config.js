/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    BACKEND_URL: process.env.BACKEND_URL,
  },
};
