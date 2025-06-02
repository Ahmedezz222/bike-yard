import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// List of allowed IP addresses (you should replace these with your actual allowed IPs)
const ALLOWED_IPS = [
  '127.0.0.1', // localhost
  // Add your production IPs here
]

// List of sensitive routes that need protection
const PROTECTED_ROUTES = [
  '/api/',
  '/admin/',
  '/products/',
]

export function middleware(request: NextRequest) {
  // Get IP from headers in the correct order of precedence
  const forwardedFor = request.headers.get('x-forwarded-for')
  const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : request.headers.get('x-real-ip')
  const path = request.nextUrl.pathname

  // Check if the route needs protection
  const isProtectedRoute = PROTECTED_ROUTES.some(route => path.startsWith(route))

  if (isProtectedRoute) {
    // Check if IP is allowed
    if (!ALLOWED_IPS.includes(ip || '')) {
      return new NextResponse(
        JSON.stringify({ error: 'Access denied' }),
        {
          status: 403,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
    }

    // Additional security headers
    const response = NextResponse.next()
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline';"
    )
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')

    return response
  }

  return NextResponse.next()
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    '/api/:path*',
    '/admin/:path*',
    '/products/:path*',
  ],
} 