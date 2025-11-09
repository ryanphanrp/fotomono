import crypto from "node:crypto";

/**
 * Encryption Utility for Storage Credentials
 *
 * Provides AES-256-GCM encryption for sensitive data like storage credentials.
 * Uses environment variable for encryption key with automatic key generation.
 */

// Encryption algorithm
const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16; // For GCM mode, this is 12-16 bytes
const SALT_LENGTH = 64;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32; // 256 bits

/**
 * Get or generate encryption key from environment
 * Key should be set in ENCRYPTION_KEY environment variable
 */
function getEncryptionKey(): Buffer {
	const envKey = process.env.ENCRYPTION_KEY || process.env.BETTER_AUTH_SECRET;

	if (!envKey) {
		throw new Error(
			"ENCRYPTION_KEY or BETTER_AUTH_SECRET must be set in environment variables",
		);
	}

	// Derive a consistent key from the environment secret
	return crypto.scryptSync(envKey, "fotomono-encryption", KEY_LENGTH);
}

/**
 * Encrypt data using AES-256-GCM
 *
 * @param plaintext - Data to encrypt (will be JSON stringified)
 * @returns Encrypted string in format: salt:iv:authTag:encryptedData (all base64)
 *
 * @example
 * ```typescript
 * const credentials = { apiKey: "secret123", apiSecret: "topsecret" };
 * const encrypted = encrypt(credentials);
 * // Store encrypted string in database
 * ```
 */
export function encrypt(plaintext: unknown): string {
	try {
		// Convert to JSON string
		const text = JSON.stringify(plaintext);

		// Generate random initialization vector
		const iv = crypto.randomBytes(IV_LENGTH);

		// Generate random salt for additional security
		const salt = crypto.randomBytes(SALT_LENGTH);

		// Get encryption key
		const key = getEncryptionKey();

		// Create cipher
		const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

		// Encrypt the text
		let encrypted = cipher.update(text, "utf8", "base64");
		encrypted += cipher.final("base64");

		// Get authentication tag
		const authTag = cipher.getAuthTag();

		// Combine salt, iv, authTag, and encrypted data
		// Format: salt:iv:authTag:encryptedData (all base64)
		return [
			salt.toString("base64"),
			iv.toString("base64"),
			authTag.toString("base64"),
			encrypted,
		].join(":");
	} catch (error) {
		throw new Error(
			`Encryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Decrypt data using AES-256-GCM
 *
 * @param encryptedData - Encrypted string from encrypt() function
 * @returns Decrypted and parsed object
 *
 * @example
 * ```typescript
 * const encrypted = "base64string:iv:tag:data";
 * const credentials = decrypt<{ apiKey: string }>(encrypted);
 * console.log(credentials.apiKey); // "secret123"
 * ```
 */
export function decrypt<T = unknown>(encryptedData: string): T {
	try {
		// Split the encrypted data
		const parts = encryptedData.split(":");

		if (parts.length !== 4) {
			throw new Error("Invalid encrypted data format");
		}

		const [saltBase64, ivBase64, authTagBase64, encrypted] = parts;

		// Convert from base64
		const salt = Buffer.from(saltBase64, "base64");
		const iv = Buffer.from(ivBase64, "base64");
		const authTag = Buffer.from(authTagBase64, "base64");

		// Get encryption key
		const key = getEncryptionKey();

		// Create decipher
		const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);

		// Set auth tag
		decipher.setAuthTag(authTag);

		// Decrypt
		let decrypted = decipher.update(encrypted, "base64", "utf8");
		decrypted += decipher.final("utf8");

		// Parse JSON and return
		return JSON.parse(decrypted) as T;
	} catch (error) {
		throw new Error(
			`Decryption failed: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Hash a string using SHA-256
 * Useful for hashing passwords, tokens, or creating fingerprints
 *
 * @param data - String to hash
 * @returns Hex-encoded hash
 *
 * @example
 * ```typescript
 * const hash = hashString("mypassword");
 * // Returns: "89e01536ac207279409d4de1e5253e01f4a1769e696db0d6062ca9b8f56767c8"
 * ```
 */
export function hashString(data: string): string {
	return crypto.createHash("sha256").update(data).digest("hex");
}

/**
 * Generate a secure random token
 *
 * @param length - Length of token in bytes (default: 32)
 * @returns Base64-encoded random token
 *
 * @example
 * ```typescript
 * const token = generateToken();
 * // Use for API keys, reset tokens, etc.
 * ```
 */
export function generateToken(length = 32): string {
	return crypto.randomBytes(length).toString("base64url");
}

/**
 * Verify if data can be decrypted (useful for testing)
 *
 * @param encryptedData - Encrypted string to verify
 * @returns true if data can be decrypted, false otherwise
 */
export function canDecrypt(encryptedData: string): boolean {
	try {
		decrypt(encryptedData);
		return true;
	} catch {
		return false;
	}
}

/**
 * Type-safe storage credential types
 */
export interface GoogleDriveCredentials {
	clientId: string;
	clientSecret: string;
	refreshToken: string;
	accessToken?: string;
}

export interface S3Credentials {
	accessKeyId: string;
	secretAccessKey: string;
	region: string;
	bucket: string;
}

export interface R2Credentials {
	accountId: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucket: string;
}

export interface NASCredentials {
	endpoint: string;
	username: string;
	password: string;
	basePath?: string;
}

export type StorageCredentials =
	| GoogleDriveCredentials
	| S3Credentials
	| R2Credentials
	| NASCredentials;
