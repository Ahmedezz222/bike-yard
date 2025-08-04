/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://r.stripe.com https://cdnjs.cloudflare.com https://va.vercel-scripts.com;
              style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
              img-src 'self' data: https: http:;
              frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
              font-src 'self' https://cdnjs.cloudflare.com;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  }
}

module.exports = nextConfig 