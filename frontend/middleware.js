// middleware.js
import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';


export async function middleware(req) {
    // Extract the token using getToken without a secret
    const token = req.cookies.get("next-auth.session-token");

    const { pathname } = req.nextUrl;

  // If the user is trying to access a /cart route and they are not authenticated
  if ((pathname.startsWith('/cart') || pathname.startsWith('/account') || pathname.startsWith('/myitems') || pathname.startsWith('/addItem')) && !token) {
    // Redirect them to the login page
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Continue to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: ['/cart/:path*', '/myitems', '/account', '/addItem',], // Apply middleware to all /cart routes
};
