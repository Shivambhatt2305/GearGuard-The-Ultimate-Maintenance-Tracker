import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Paths that don't require authentication
const PUBLIC_PATHS = ['/login', '/signup', '/logout', '/favicon.ico', '/robots.txt']

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Allow Next.js internals and static files
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next()
  }

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))) {
    return NextResponse.next()
  }

  // Check cookie
  const isAuth = req.cookies.get('isAuthenticated')?.value === '1'
  if (!isAuth) {
    const loginUrl = req.nextUrl.clone()
    loginUrl.pathname = '/login'
    // preserve the original path so we can redirect back after login if desired
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/((?!_next).*)'],
}
