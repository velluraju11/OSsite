import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './app/admin/actions';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If user is trying to access login page but is already logged in, redirect to dashboard
  if (session && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If user is trying to access a protected admin page and is not logged in, redirect to login
  if (!session && pathname.startsWith('/admin') && pathname !== '/admin/login') {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
