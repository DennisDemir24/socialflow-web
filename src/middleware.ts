import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
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

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });
  const { pathname } = request.nextUrl;

  // Check if the user is authenticated
  const { data: { session } } = await supabase.auth.getSession();

  // Redirect authenticated users away from auth pages
  if (session && authPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect non-authenticated users to sign in page
  if (!session && protectedPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return res;
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