/**
 * Application Routes Configuration
 *
 * Centralized route definitions for the application.
 * Used by middleware, navigation components, and redirect logic.
 */

/**
 * Public routes - accessible without authentication
 */
export const PUBLIC_ROUTES = [
	"/",
	"/login",
	"/register",
	"/about", // Future
	"/pricing", // Future
] as const;

/**
 * Authentication routes - login and register pages
 * Authenticated users will be redirected away from these
 */
export const AUTH_ROUTES = ["/login", "/register"] as const;

/**
 * Protected routes - require authentication
 * Unauthenticated users will be redirected to login
 */
export const PROTECTED_ROUTES = [
	"/dashboard",
	"/shows",
	"/images",
	"/portfolio",
	"/albums",
	"/settings",
] as const;

/**
 * Default redirect after login
 */
export const DEFAULT_LOGIN_REDIRECT = "/dashboard";

/**
 * Default redirect for unauthenticated users
 */
export const DEFAULT_AUTH_REDIRECT = "/login";

/**
 * Routes that should be excluded from middleware processing
 */
export const MIDDLEWARE_EXCLUDE_PATTERNS = [
	"/_next/static",
	"/_next/image",
	"/favicon.ico",
	"/api",
	"/static",
] as const;

/**
 * Check if a path is a public route
 */
export function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Check if a path is an auth route (login/register)
 */
export function isAuthRoute(pathname: string): boolean {
	return AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Check if a path is a protected route
 */
export function isProtectedRoute(pathname: string): boolean {
	return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/**
 * Check if a path should be excluded from middleware
 */
export function shouldExcludeFromMiddleware(pathname: string): boolean {
	return (
		MIDDLEWARE_EXCLUDE_PATTERNS.some((pattern) => pathname.startsWith(pattern)) ||
		pathname.includes(".")
	);
}
