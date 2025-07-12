import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = request.cookies.has('firebase-auth-token');

  const authRoutes = ['/login', '/signup'];
  const protectedRoutes = ['/ask', '/admin'];

  // If user is logged in, redirect from login/signup pages to home
  if (hasAuthCookie && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // If user is not logged in, protect routes
  if (protectedRoutes.some(route => pathname.startsWith(route))) {
    if (!hasAuthCookie) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Note: Role-based protection for /admin now relies on the page component itself
    // as we cannot decode the token in the middleware without Node.js APIs.
    // The redirect logic in src/app/admin/page.tsx already handles this.
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
