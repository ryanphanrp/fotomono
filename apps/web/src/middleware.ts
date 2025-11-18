import { auth } from "@fotomono/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  DEFAULT_AUTH_REDIRECT,
  DEFAULT_LOGIN_REDIRECT,
  isAuthRoute,
  isProtectedRoute,
  shouldExcludeFromMiddleware,
} from "@/lib/routes";

/**
 * Next.js Middleware for Authentication & Route Protection
 *
 * This middleware:
 * 1. Checks user session on every request
 * 2. Protects routes that require authentication
 * 3. Redirects unauthenticated users to /login
 * 4. Redirects authenticated users away from auth pages
 */

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip middleware for static files, API routes, and Next.js internals
  if (shouldExcludeFromMiddleware(pathname)) {
    return NextResponse.next();
  }

  try {
    // Get session from Better-Auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    const isAuthenticated = !!session?.session;
    const authRoute = isAuthRoute(pathname);
    const protectedRoute = isProtectedRoute(pathname);

    // If user is authenticated and trying to access auth pages (login/register)
    // Redirect to dashboard
    if (isAuthenticated && authRoute) {
      return NextResponse.redirect(
        new URL(DEFAULT_LOGIN_REDIRECT, request.url)
      );
    }

    // If user is not authenticated and trying to access protected routes
    // Redirect to login with callback URL
    if (!isAuthenticated && protectedRoute) {
      const loginUrl = new URL(DEFAULT_AUTH_REDIRECT, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow the request to proceed
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);

    // On error, redirect to login for protected routes
    if (isProtectedRoute(pathname)) {
      const loginUrl = new URL(DEFAULT_AUTH_REDIRECT, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow public routes to proceed even on error
    return NextResponse.next();
  }
}

/**
 * Matcher configuration
 * Only run middleware on specific paths to improve performance
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
