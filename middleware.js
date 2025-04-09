import { NextResponse } from 'next/server';
import { getSessionToken } from './src/pages/api/auth/auth';

export async function middleware(request) {
  const session = await getSessionToken(request.cookies);
  const { pathname } = request.nextUrl;

  // Protected routes
  const protectedRoutes = ['/dashboard', '/profile', '/orders'];
  const isProtected = protectedRoutes.some(route => pathname.startsWith(route));

  // Auth routes
  const authRoutes = ['/login', '/signup'];
  const isAuthRoute = authRoutes.includes(pathname);

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}