# tRPC API Routers

## Authentication Router (`auth`)

### Procedures

#### `auth.register`
Register a new user account.

**Type:** Mutation
**Access:** Public

**Input:**
```typescript
{
  name: string;      // Min 2 chars, Max 100 chars
  email: string;     // Valid email format
  password: string;  // Min 8 chars, must contain uppercase, lowercase, and number
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

**Errors:**
- `CONFLICT` - Email already exists
- `INTERNAL_SERVER_ERROR` - Failed to create account

---

#### `auth.login`
Login with email and password.

**Type:** Mutation
**Access:** Public

**Input:**
```typescript
{
  email: string;
  password: string;
  rememberMe?: boolean; // Optional, defaults to false
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
  }
}
```

**Errors:**
- `UNAUTHORIZED` - Invalid credentials

---

#### `auth.logout`
Logout current user.

**Type:** Mutation
**Access:** Protected (requires authentication)

**Input:** None

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

---

#### `auth.getSession`
Get current user session.

**Type:** Query
**Access:** Public

**Input:** None

**Output:**
```typescript
{
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string;
    image: string | null;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  session: {
    id: string;
    expiresAt: Date;
  } | null;
}
```

---

#### `auth.updateProfile`
Update user profile information.

**Type:** Mutation
**Access:** Protected

**Input:**
```typescript
{
  name?: string;  // Min 2 chars, Max 100 chars
  email?: string; // Valid email format
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
  user: UserObject;
}
```

---

#### `auth.changePassword`
Change user password.

**Type:** Mutation
**Access:** Protected

**Input:**
```typescript
{
  currentPassword: string;
  newPassword: string; // Min 8 chars, must contain uppercase, lowercase, and number
}
```

**Output:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Errors:**
- `BAD_REQUEST` - Current password is incorrect
- `INTERNAL_SERVER_ERROR` - Failed to change password

---

## Usage Examples

### Client-side (Next.js)

```typescript
import { trpc } from '@/lib/trpc';

// Register
const { mutate: register } = trpc.auth.register.useMutation();
register({
  name: "John Doe",
  email: "john@example.com",
  password: "SecurePass123"
});

// Login
const { mutate: login } = trpc.auth.login.useMutation();
login({
  email: "john@example.com",
  password: "SecurePass123",
  rememberMe: true
});

// Get session
const { data: session } = trpc.auth.getSession.useQuery();

// Logout
const { mutate: logout } = trpc.auth.logout.useMutation();
logout();

// Update profile
const { mutate: updateProfile } = trpc.auth.updateProfile.useMutation();
updateProfile({
  name: "John Smith"
});

// Change password
const { mutate: changePassword } = trpc.auth.changePassword.useMutation();
changePassword({
  currentPassword: "OldPass123",
  newPassword: "NewPass123"
});
```
