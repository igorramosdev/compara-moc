const withPWA = require('next-pwa')({
  dest: 'public',
  disable: false, // Habilitando em development para testes
  register: true,
  skipWaiting: true
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
}

module.exports = withPWA(nextConfig)