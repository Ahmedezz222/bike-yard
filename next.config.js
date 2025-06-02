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
              connect-src 'self' https://api.stripe.com https://r.stripe.com;
              frame-src 'self' https://js.stripe.com https://hooks.stripe.com;
              font-src 'self' https://cdnjs.cloudflare.com;
            `.replace(/\s+/g, ' ').trim()
          }
        ]
      }
    ]
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.warn('NEXT_PUBLIC_API_URL is not set. API rewrites will be disabled.');
      return [];
    }
    
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/api/:path*`
      }
    ];
  }
}

module.exports = nextConfig 