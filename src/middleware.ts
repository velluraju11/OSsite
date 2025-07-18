import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSession } from './app/root/actions';

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const { pathname } = request.nextUrl;

  // If user is logged in, redirect from /root/login to /root/playground
  if (session && pathname === '/root/login') {
    return NextResponse.redirect(new URL('/root/playground', request.url));
  }

  // If user is not logged in, protect /root/playground
  if (!session && pathname.startsWith('/root/playground')) {
    return NextResponse.redirect(new URL('/root/login', request.url));
  }
  
  // If user tries to access /root, redirect to login or playground
  if (pathname === '/root' || pathname === '/root/') {
      if (session) {
          return NextResponse.redirect(new URL('/root/playground', request.url));
      }
      return NextResponse.redirect(new URL('/root/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/root/:path*'],
};
