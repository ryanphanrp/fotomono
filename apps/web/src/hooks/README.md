# Authentication Hooks Documentation

## Overview

FotoMono provides three authentication hooks for managing user sessions and authentication state in client components:

- **`useAuth()`** - Full authentication state with logout functionality
- **`useSession()`** - Simplified session data access
- **`useRequireAuth()`** - Protected route helper with auto-redirect

All hooks use tRPC for type-safe API calls and React Query for efficient state management.

---

## `useAuth()`

**Full-featured authentication hook with logout capability.**

### Usage

```tsx
"use client";

import { useAuth } from "@/hooks/useAuth";

export default function UserProfile() {
  const { user, isAuthenticated, isLoading, logout, isLoggingOut } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>{user.email}</p>
      <button onClick={logout} disabled={isLoggingOut}>
        {isLoggingOut ? "Logging out..." : "Logout"}
      </button>
    </div>
  );
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user object with id, name, email, etc. |
| `session` | `Session \| null` | Session object with id and expiresAt |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Whether session is being fetched |
| `error` | `Error \| null` | Any error from session fetch |
| `logout` | `() => void` | Function to logout user |
| `refetch` | `() => Promise` | Manually refetch session data |
| `isLoggingOut` | `boolean` | Whether logout is in progress |

### User Object Type

```typescript
{
  id: string;
  email: string;
  name: string;
  image: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## `useSession()`

**Simplified hook for accessing session data without logout functionality.**

Use this when you only need to display user information and don't need logout capability.

### Usage

```tsx
"use client";

import { useSession } from "@/hooks/useAuth";

export default function UserAvatar() {
  const { user, isAuthenticated, isLoading } = useSession();

  if (isLoading) return <Skeleton />;
  if (!isAuthenticated) return null;

  return (
    <div>
      <img src={user.image || "/default-avatar.png"} alt={user.name} />
      <span>{user.name}</span>
    </div>
  );
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user object |
| `session` | `Session \| null` | Session object |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Whether session is being fetched |
| `error` | `Error \| null` | Any error from session fetch |

---

## `useRequireAuth()`

**Protected route helper that automatically redirects unauthenticated users to login.**

Use this hook in pages/components that require authentication. It will redirect to `/login` if the user is not authenticated.

### Usage

```tsx
"use client";

import { useRequireAuth } from "@/hooks/useAuth";

export default function ProtectedPage() {
  const { user, isLoading, isAuthenticated } = useRequireAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // User is guaranteed to be authenticated at this point
  // (or will be redirected to login)
  return (
    <div>
      <h1>Protected Content</h1>
      <p>Only visible to: {user.name}</p>
    </div>
  );
}
```

### Return Values

| Property | Type | Description |
|----------|------|-------------|
| `user` | `User \| null` | Current user object |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `isLoading` | `boolean` | Whether session is being fetched |

### Important Notes

- This hook will redirect to `/login` if user is not authenticated
- Always check `isLoading` before rendering protected content
- The middleware also handles route protection at the server level
- This hook provides additional client-side protection

---

## Common Patterns

### Pattern 1: Conditional Rendering Based on Auth

```tsx
const { isAuthenticated, isLoading } = useSession();

if (isLoading) return <Loader />;

return isAuthenticated ? <AuthenticatedView /> : <PublicView />;
```

### Pattern 2: Show User Info in Header

```tsx
export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header>
      <Logo />
      {isAuthenticated ? (
        <div>
          <span>{user.name}</span>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </header>
  );
}
```

### Pattern 3: Protected Page Component

```tsx
export default function DashboardPage() {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome back, {user.name}!</p>
      {/* Protected content */}
    </div>
  );
}
```

### Pattern 4: Logout with Confirmation

```tsx
const { logout, isLoggingOut } = useAuth();

const handleLogout = async () => {
  if (confirm("Are you sure you want to logout?")) {
    logout();
  }
};

return (
  <button onClick={handleLogout} disabled={isLoggingOut}>
    {isLoggingOut ? "Logging out..." : "Logout"}
  </button>
);
```

---

## Integration with tRPC

All hooks use tRPC procedures for authentication:

- **Session query:** `trpc.auth.getSession.useQuery()`
- **Logout mutation:** `trpc.auth.logout.useMutation()`

### React Query Configuration

The hooks use these React Query options:
- `retry: 1` - Only retry once on failure
- `refetchOnWindowFocus: false` - Don't refetch when window regains focus

You can customize this by wrapping the tRPC calls with your own configuration.

---

## Error Handling

### Session Fetch Errors

```tsx
const { error, isLoading } = useSession();

if (error) {
  return <ErrorMessage>Failed to load session</ErrorMessage>;
}
```

### Logout Errors

Logout errors are automatically displayed as toast notifications. You can customize this in the hook if needed.

---

## Server-Side vs Client-Side Auth

**Server-Side (Middleware):**
- Runs on every request
- Redirects before page loads
- Best for route protection
- Uses Next.js middleware

**Client-Side (Hooks):**
- Runs after page loads
- Better UX with loading states
- Useful for conditional UI
- Uses React hooks

**Best Practice:** Use both for defense in depth!

---

## Performance Considerations

### Caching

React Query automatically caches session data. The session is fetched once and reused across all hooks.

### Refetching

Session data is NOT automatically refetched on window focus. This prevents unnecessary API calls but means session changes may not be immediately reflected.

To manually refresh session:
```tsx
const { refetch } = useAuth();

// Manually refresh session
await refetch();
```

### Optimizations

1. Use `useSession()` instead of `useAuth()` when you don't need logout
2. Use `useRequireAuth()` for protected pages (simplest API)
3. Session query is shared across all hooks (only one fetch)

---

## Testing

### Testing Components with useAuth

```tsx
import { renderHook } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";

// Mock tRPC
jest.mock("@/utils/trpc", () => ({
  trpc: {
    auth: {
      getSession: {
        useQuery: jest.fn(),
      },
      logout: {
        useMutation: jest.fn(),
      },
    },
  },
}));

test("useAuth returns user data", () => {
  const { result } = renderHook(() => useAuth());

  expect(result.current.isAuthenticated).toBe(true);
  expect(result.current.user.email).toBe("test@example.com");
});
```

---

## Migration from Better-Auth Client

If you were using Better-Auth client directly, migrate to these hooks:

### Before (Better-Auth Client)

```tsx
import { authClient } from "@/lib/auth-client";

const { data: session } = authClient.useSession();
```

### After (tRPC Hooks)

```tsx
import { useSession } from "@/hooks/useAuth";

const { user, isAuthenticated } = useSession();
```

### Benefits

- ✅ Type-safe with tRPC
- ✅ Better error handling
- ✅ Consistent with rest of app
- ✅ Additional helper hooks
- ✅ Logout functionality included

---

## Future Enhancements

Planned improvements for Phase 2:

- [ ] `usePermissions()` hook for role-based access
- [ ] `useAuthModal()` for inline login/register
- [ ] `useUpdateProfile()` mutation hook
- [ ] `useChangePassword()` mutation hook
- [ ] Email verification status in session
- [ ] Two-factor authentication state
- [ ] Session expiry countdown
- [ ] Active sessions management

---

## Related Files

- `apps/web/src/hooks/useAuth.ts` - Hook implementations
- `apps/web/src/utils/trpc.ts` - tRPC client configuration
- `apps/web/src/middleware.ts` - Server-side auth middleware
- `packages/api/src/routers/auth.ts` - Auth tRPC procedures
