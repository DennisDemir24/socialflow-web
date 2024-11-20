import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add the paths that should be protected
const protectedPaths = [
  '/dashboard',
  '/calendar',
  '/settings',
  '/posts'
];

// Add the paths that should be accessible only to non-authenticated users
const authPaths = [
  '/auth/signin',
  '/auth/signup'
];

export function middleware(request: NextRequest) {
  const currentUser = request.cookies.get('sessionId');
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages
  if (currentUser && authPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect non-authenticated users to sign in page
  if (!currentUser && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};