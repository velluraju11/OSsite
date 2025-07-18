import 'dotenv/config';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './app/admin/actions';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If user is logged in, redirect from /admin/login to /admin/dashboard
  if (session && pathname === '/admin/login') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // If user is not logged in, protect /admin/dashboard
  if (!session && pathname.startsWith('/admin/dashboard')) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  
  // If user tries to access /admin, redirect to login or dashboard
  if (pathname === '/admin' || pathname === '/admin/') {
      if (session) {
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
      return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
