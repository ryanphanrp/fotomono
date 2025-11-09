# Encryption Utility Documentation

## Overview

The encryption utility provides secure AES-256-GCM encryption for sensitive data, primarily used for storing cloud storage credentials in the database.

**Algorithm:** AES-256-GCM (Galois/Counter Mode)
**Key Size:** 256 bits
**Security Features:**
- Authenticated encryption (integrity + confidentiality)
- Random IV for each encryption
- Random salt for key derivation
- Authentication tags to prevent tampering

---

## Setup

### Environment Variable

Set the encryption key in your `.env` file:

```bash
# Option 1: Dedicated encryption key
ENCRYPTION_KEY=your-secret-key-at-least-32-chars-long

# Option 2: Fallback to Better-Auth secret (if ENCRYPTION_KEY not set)
BETTER_AUTH_SECRET=your-secret-key-here
```

**Generate a secure key:**
```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ Important:**
- Never commit the encryption key to version control
- Use different keys for development and production
- Store production keys in secure environment variable management (e.g., Vercel, Railway)

---

## API Reference

### `encrypt(plaintext: unknown): string`

Encrypts data and returns a base64-encoded string.

**Parameters:**
- `plaintext` - Any JSON-serializable data to encrypt

**Returns:** Encrypted string in format: `salt:iv:authTag:encryptedData`

**Example:**
```typescript
import { encrypt } from "@fotomono/api/utils/encryption";

const credentials = {
  accessKeyId: "AKIA...",
  secretAccessKey: "secret123",
  region: "us-east-1",
  bucket: "my-bucket"
};

const encrypted = encrypt(credentials);
// Store in database
await db.storageConfig.create({
  data: {
    userId: "user123",
    providerType: "s3",
    credentialsEncrypted: encrypted,
  },
});
```

---

### `decrypt<T>(encryptedData: string): T`

Decrypts data and returns the original object.

**Type Parameter:**
- `T` - Expected type of decrypted data (for type safety)

**Parameters:**
- `encryptedData` - Encrypted string from `encrypt()`

**Returns:** Decrypted and parsed object of type `T`

**Example:**
```typescript
import { decrypt, type S3Credentials } from "@fotomono/api/utils/encryption";

const storageConfig = await db.storageConfig.findUnique({
  where: { userId: "user123" },
});

const credentials = decrypt<S3Credentials>(storageConfig.credentialsEncrypted);

console.log(credentials.accessKeyId); // "AKIA..."
console.log(credentials.secretAccessKey); // "secret123"
```

---

### `hashString(data: string): string`

Creates a SHA-256 hash of a string.

**Use Cases:**
- Hashing passwords (use Better-Auth for user passwords)
- Creating fingerprints for data
- Generating consistent IDs from strings

**Parameters:**
- `data` - String to hash

**Returns:** Hex-encoded hash (64 characters)

**Example:**
```typescript
import { hashString } from "@fotomono/api/utils/encryption";

const hash = hashString("mydata");
// Returns: "c3ab8ff13720e8ad9047dd39466b3c8974e592c2fa383d4a3960714caef0c4f2"

// Use for creating unique IDs
const tokenId = hashString(`${userId}-${timestamp}`);
```

---

### `generateToken(length?: number): string`

Generates a cryptographically secure random token.

**Parameters:**
- `length` - Length in bytes (default: 32)

**Returns:** Base64url-encoded token

**Use Cases:**
- API keys
- Reset tokens
- Session tokens
- Unique identifiers

**Example:**
```typescript
import { generateToken } from "@fotomono/api/utils/encryption";

// Generate 32-byte token (default)
const apiKey = generateToken();

// Generate custom length
const shortToken = generateToken(16);
const longToken = generateToken(64);

// Use for password reset
const resetToken = generateToken();
await db.passwordReset.create({
  data: {
    userId: "user123",
    token: resetToken,
    expiresAt: new Date(Date.now() + 3600000), // 1 hour
  },
});
```

---

### `canDecrypt(encryptedData: string): boolean`

Verifies if data can be successfully decrypted.

**Parameters:**
- `encryptedData` - Encrypted string to verify

**Returns:** `true` if valid, `false` otherwise

**Use Cases:**
- Validating encrypted data before use
- Testing encryption/decryption
- Error handling

**Example:**
```typescript
import { canDecrypt, decrypt } from "@fotomono/api/utils/encryption";

const encrypted = storageConfig.credentialsEncrypted;

if (!canDecrypt(encrypted)) {
  console.error("Invalid or corrupted credentials");
  return;
}

const credentials = decrypt(encrypted);
```

---

## Type Definitions

### Storage Credential Types

The utility provides TypeScript interfaces for common storage credentials:

```typescript
import type {
  GoogleDriveCredentials,
  S3Credentials,
  R2Credentials,
  NASCredentials,
} from "@fotomono/api/utils/encryption";

// Google Drive
interface GoogleDriveCredentials {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
  accessToken?: string;
}

// AWS S3
interface S3Credentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
}

// Cloudflare R2
interface R2Credentials {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
}

// Network Attached Storage
interface NASCredentials {
  endpoint: string;
  username: string;
  password: string;
  basePath?: string;
}
```

---

## Complete Example: Storage Config

### Saving Storage Credentials

```typescript
import { encrypt, type S3Credentials } from "@fotomono/api/utils/encryption";
import { db } from "@fotomono/db";

export async function saveStorageConfig(userId: string, credentials: S3Credentials) {
  // Encrypt credentials
  const encrypted = encrypt(credentials);

  // Save to database
  const config = await db.storageConfig.create({
    data: {
      userId,
      providerType: "s3",
      credentialsEncrypted: encrypted,
      bucketName: credentials.bucket,
      region: credentials.region,
      isActive: true,
    },
  });

  return config;
}
```

### Loading Storage Credentials

```typescript
import { decrypt, type S3Credentials } from "@fotomono/api/utils/encryption";
import { db } from "@fotomono/db";

export async function getStorageCredentials(userId: string): Promise<S3Credentials> {
  // Fetch from database
  const config = await db.storageConfig.findFirst({
    where: {
      userId,
      isActive: true,
    },
  });

  if (!config) {
    throw new Error("No active storage configuration found");
  }

  // Decrypt credentials
  const credentials = decrypt<S3Credentials>(config.credentialsEncrypted);

  return credentials;
}
```

### Using with tRPC

```typescript
import { protectedProcedure } from "../index";
import { encrypt, decrypt, type S3Credentials } from "../utils/encryption";
import { z } from "zod";

export const storageRouter = router({
  saveS3Config: protectedProcedure
    .input(z.object({
      accessKeyId: z.string(),
      secretAccessKey: z.string(),
      region: z.string(),
      bucket: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Encrypt before saving
      const encrypted = encrypt(input);

      const config = await db.storageConfig.create({
        data: {
          userId: ctx.session.user.id,
          providerType: "s3",
          credentialsEncrypted: encrypted,
          bucketName: input.bucket,
          region: input.region,
          isActive: true,
        },
      });

      return { success: true, configId: config.id };
    }),

  getS3Credentials: protectedProcedure
    .query(async ({ ctx }) => {
      const config = await db.storageConfig.findFirst({
        where: {
          userId: ctx.session.user.id,
          providerType: "s3",
          isActive: true,
        },
      });

      if (!config) return null;

      // Decrypt for use
      const credentials = decrypt<S3Credentials>(config.credentialsEncrypted);

      // Return credentials (only in backend, never send to client)
      return credentials;
    }),
});
```

---

## Security Best Practices

### ✅ DO

- ✅ Use environment variables for encryption keys
- ✅ Use different keys for dev/staging/production
- ✅ Rotate encryption keys periodically (with re-encryption)
- ✅ Validate decrypted data before use
- ✅ Log encryption/decryption errors for monitoring
- ✅ Use type-safe interfaces for credentials
- ✅ Only decrypt data on the server (never send encrypted data to client)

### ❌ DON'T

- ❌ Store encryption keys in code or database
- ❌ Use the same key across all environments
- ❌ Send encrypted data to client-side
- ❌ Skip error handling on decrypt operations
- ❌ Re-use IVs (initialization vectors are generated automatically)
- ❌ Store plaintext credentials alongside encrypted ones
- ❌ Commit `.env` files with real keys

---

## Error Handling

### Common Errors

**1. Missing Encryption Key**
```
Error: ENCRYPTION_KEY or BETTER_AUTH_SECRET must be set in environment variables
```
**Solution:** Set `ENCRYPTION_KEY` in `.env` file

**2. Invalid Encrypted Data Format**
```
Error: Invalid encrypted data format
```
**Solution:** Encrypted data may be corrupted or not from this utility

**3. Decryption Failed**
```
Error: Decryption failed: Unsupported state or unable to authenticate data
```
**Solution:** Wrong encryption key or tampered data

### Handling Errors

```typescript
import { decrypt, canDecrypt } from "@fotomono/api/utils/encryption";

try {
  // Verify before decrypting
  if (!canDecrypt(encrypted)) {
    throw new Error("Invalid encrypted data");
  }

  const credentials = decrypt(encrypted);
  // Use credentials
} catch (error) {
  console.error("Failed to decrypt credentials:", error);
  // Handle error (e.g., prompt user to re-enter credentials)
}
```

---

## Testing

### Unit Tests

```typescript
import { encrypt, decrypt, hashString, generateToken } from "./encryption";

describe("Encryption Utility", () => {
  it("should encrypt and decrypt data correctly", () => {
    const original = { apiKey: "test123", secret: "topsecret" };
    const encrypted = encrypt(original);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toEqual(original);
  });

  it("should generate different ciphertext for same input", () => {
    const data = { test: "data" };
    const encrypted1 = encrypt(data);
    const encrypted2 = encrypt(data);

    expect(encrypted1).not.toBe(encrypted2); // Different IVs
  });

  it("should hash strings consistently", () => {
    const hash1 = hashString("test");
    const hash2 = hashString("test");

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
  });

  it("should generate unique tokens", () => {
    const token1 = generateToken();
    const token2 = generateToken();

    expect(token1).not.toBe(token2);
  });
});
```

---

## Performance Considerations

- **Encryption Speed:** ~1ms for typical credential objects
- **Overhead:** ~100 bytes for salt + IV + auth tag
- **Caching:** Decrypt once, cache result (don't decrypt on every request)
- **Batch Operations:** Encrypt/decrypt in parallel for multiple configs

### Optimization Example

```typescript
// ❌ Bad: Decrypt on every request
app.get("/upload", async (req, res) => {
  const config = await db.storageConfig.findFirst({ where: { userId } });
  const creds = decrypt(config.credentialsEncrypted); // Decrypts every time
  // Use creds...
});

// ✅ Good: Cache decrypted credentials
const credentialsCache = new Map();

app.get("/upload", async (req, res) => {
  let creds = credentialsCache.get(userId);

  if (!creds) {
    const config = await db.storageConfig.findFirst({ where: { userId } });
    creds = decrypt(config.credentialsEncrypted);
    credentialsCache.set(userId, creds);
  }

  // Use cached creds...
});
```

---

## Key Rotation (Phase 2)

For rotating encryption keys:

1. Generate new key
2. Decrypt all data with old key
3. Re-encrypt with new key
4. Update database
5. Update environment variable

```typescript
export async function rotateEncryptionKey(oldKey: string, newKey: string) {
  const configs = await db.storageConfig.findMany();

  for (const config of configs) {
    // Decrypt with old key
    const plaintext = decryptWithKey(config.credentialsEncrypted, oldKey);

    // Re-encrypt with new key
    const reencrypted = encryptWithKey(plaintext, newKey);

    // Update database
    await db.storageConfig.update({
      where: { id: config.id },
      data: { credentialsEncrypted: reencrypted },
    });
  }
}
```

---

## Related Files

- `packages/api/src/utils/encryption.ts` - Implementation
- `packages/db/src/schema/storage.ts` - Storage config schema
- `packages/api/src/routers/storage.ts` - Storage tRPC procedures (Phase 3)
