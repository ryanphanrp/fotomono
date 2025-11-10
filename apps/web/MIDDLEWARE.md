# Authentication Middleware Documentation

## Overview

The FotoMono application uses Next.js middleware to protect routes and manage authentication flow. This ensures that unauthenticated users cannot access protected pages and authenticated users have a seamless experience.

## How It Works

### Middleware Flow

```
User requests a page
    ↓
Middleware intercepts request
    ↓
Check if route should be excluded (static files, API routes)
    ├─ Yes → Allow request
    └─ No → Continue
    ↓
Get user session from Better-Auth
    ↓
Check authentication status
    ├─ Authenticated
    │   ├─ Accessing auth route (/login, /register)?
    │   │   └─ Redirect to /dashboard
    │   └─ Accessing other route?
    │       └─ Allow request
    └─ Not authenticated
        ├─ Accessing protected route?
        │   └─ Redirect to /login?callbackUrl=<requested-path>
        └─ Accessing public route?
            └─ Allow request
```

## Route Types

### Public Routes
Routes accessible to everyone (authenticated or not):
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/about` - About page (future)
- `/pricing` - Pricing page (future)

### Auth Routes
Routes that authenticated users should not access (they'll be redirected to dashboard):
- `/login`
- `/register`

### Protected Routes
Routes that require authentication:
- `/dashboard` - Main dashboard
- `/shows` - Photography shows management
- `/images` - Image gallery and management
- `/portfolio` - Portfolio management
- `/albums` - Client album management
- `/settings` - User settings

## Configuration

### Route Constants (`apps/web/src/lib/routes.ts`)

All route definitions are centralized in this file:

```typescript
export const PUBLIC_ROUTES = ["/", "/login", "/register"] as const;
export const AUTH_ROUTES = ["/login", "/register"] as const;
export const PROTECTED_ROUTES = ["/dashboard", "/shows", ...] as const;
```

**To add a new protected route:**
1. Add it to `PROTECTED_ROUTES` in `lib/routes.ts`
2. The middleware will automatically protect it

**To add a new public route:**
1. Add it to `PUBLIC_ROUTES` in `lib/routes.ts`
2. The route will be accessible without authentication

### Middleware Matcher

The middleware uses a Next.js matcher to exclude certain paths from processing:

```typescript
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

This excludes:
- Static files (`_next/static`)
- Image optimization (`_next/image`)
- Favicon
- Image files with extensions

## Callback URL Flow

When an unauthenticated user tries to access a protected route:

1. **Middleware intercepts:** User visits `/dashboard/settings`
2. **No session found:** User is not authenticated
3. **Redirect with callback:** User redirected to `/login?callbackUrl=/dashboard/settings`
4. **User logs in:** Sign-in form reads the `callbackUrl` parameter
5. **Redirect to original:** After successful login, user redirected to `/dashboard/settings`

### Implementation in Forms

Both sign-in and sign-up forms read the callback URL:

```typescript
const searchParams = useSearchParams();
const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

// On successful auth
router.push(callbackUrl);
```

## Error Handling

If an error occurs during session verification:
- **Protected routes:** Redirect to login (safe default)
- **Public routes:** Allow the request to proceed

Errors are logged to console for debugging:
```typescript
console.error("Middleware error:", error);
```

## Testing the Middleware

### Test Case 1: Access Protected Route (Unauthenticated)
1. Clear cookies/logout
2. Visit `http://localhost:3001/dashboard`
3. **Expected:** Redirect to `/login?callbackUrl=/dashboard`

### Test Case 2: Login and Redirect
1. After Test Case 1, enter credentials
2. **Expected:** Redirect to `/dashboard` (original destination)

### Test Case 3: Access Auth Route (Authenticated)
1. Login first
2. Visit `http://localhost:3001/login`
3. **Expected:** Redirect to `/dashboard`

### Test Case 4: Access Public Route (Unauthenticated)
1. Logout
2. Visit `http://localhost:3001/`
3. **Expected:** Page loads normally

### Test Case 5: Static Files
1. Request any static file (e.g., image)
2. **Expected:** File served without middleware processing

## Performance Considerations

- **Matcher optimization:** Uses regex to exclude static files at the framework level
- **Early returns:** Checks for excluded paths before session verification
- **Minimal redirects:** Only redirects when necessary

## Security Considerations

- **Session verification:** Uses Better-Auth's secure session checking
- **HTTPS cookies:** Sessions stored in HTTP-only, secure cookies
- **No session leakage:** Session data not exposed to client
- **Error handling:** Fails securely (redirects to login on error)

## Troubleshooting

### Infinite redirect loop
**Problem:** User gets stuck in redirect loop
**Solution:**
- Check if `/login` is in `PROTECTED_ROUTES` (it shouldn't be)
- Verify session is being set correctly after login

### Middleware not running
**Problem:** Protected routes accessible without auth
**Solution:**
- Check middleware file location: `apps/web/src/middleware.ts`
- Verify matcher configuration
- Check Next.js version (middleware requires Next.js 12+)

### Session not persisting
**Problem:** User logged out immediately after login
**Solution:**
- Check Better-Auth configuration (cookie settings)
- Verify `credentials: "include"` in tRPC client
- Check browser cookie settings

## Future Enhancements (Phase 2)

- [ ] Role-based access control (Admin, Photographer, Editor)
- [ ] Rate limiting for auth routes
- [ ] IP-based blocking for suspicious activity
- [ ] Email verification requirement
- [ ] Two-factor authentication
- [ ] Session management (view active sessions, logout all devices)

## Related Files

- `apps/web/src/middleware.ts` - Middleware implementation
- `apps/web/src/lib/routes.ts` - Route configuration
- `apps/web/src/components/sign-in-form.tsx` - Login form with callback
- `apps/web/src/components/sign-up-form.tsx` - Registration form with callback
- `packages/auth/src/index.ts` - Better-Auth configuration
