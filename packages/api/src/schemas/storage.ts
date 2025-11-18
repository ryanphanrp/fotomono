import { z } from "zod";

/**
 * Storage provider types
 */
export const storageProviderEnum = z.enum(["s3", "r2", "google-drive", "nas"]);

export type StorageProvider = z.infer<typeof storageProviderEnum>;

/**
 * Base storage configuration
 */
const baseStorageConfigSchema = z.object({
  providerType: storageProviderEnum,
  providerName: z.string().optional(),
  bucketName: z.string().optional(),
  region: z.string().optional(),
  folderPath: z.string().optional(),
  publicUrl: z.string().url().optional(),
  isDefault: z.boolean().default(false),
});

/**
 * S3-specific credentials
 */
const s3CredentialsSchema = z.object({
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  region: z.string().min(1, "Region is required"),
  bucket: z.string().min(1, "Bucket name is required"),
  endpoint: z.string().url().optional(),
});

/**
 * R2-specific credentials
 */
const r2CredentialsSchema = z.object({
  accountId: z.string().min(1, "Account ID is required"),
  accessKeyId: z.string().min(1, "Access Key ID is required"),
  secretAccessKey: z.string().min(1, "Secret Access Key is required"),
  bucket: z.string().min(1, "Bucket name is required"),
});

/**
 * Google Drive credentials
 */
const googleDriveCredentialsSchema = z.object({
  clientId: z.string().min(1, "Client ID is required"),
  clientSecret: z.string().min(1, "Client Secret is required"),
  refreshToken: z.string().min(1, "Refresh Token is required"),
  redirectUri: z.string().url().optional(),
  folderId: z.string().optional(),
});

/**
 * NAS credentials
 */
const nasCredentialsSchema = z.object({
  endpoint: z.string().url("Valid endpoint URL is required"),
  apiKey: z.string().optional(),
  basePath: z.string().optional(),
});

/**
 * Set storage configuration schema
 */
export const setStorageConfigSchema = z
  .object({
    providerType: storageProviderEnum,
    providerName: z.string().optional(),
    bucketName: z.string().optional(),
    region: z.string().optional(),
    folderPath: z.string().optional(),
    publicUrl: z.string().url().optional(),
    isDefault: z.boolean().default(false),
    credentials: z.union([
      s3CredentialsSchema,
      r2CredentialsSchema,
      googleDriveCredentialsSchema,
      nasCredentialsSchema,
    ]),
  })
  .refine(
    (data) => {
      // Validate credentials match provider type
      if (data.providerType === "s3") {
        return s3CredentialsSchema.safeParse(data.credentials).success;
      }
      if (data.providerType === "r2") {
        return r2CredentialsSchema.safeParse(data.credentials).success;
      }
      if (data.providerType === "google-drive") {
        return googleDriveCredentialsSchema.safeParse(data.credentials).success;
      }
      if (data.providerType === "nas") {
        return nasCredentialsSchema.safeParse(data.credentials).success;
      }
      return false;
    },
    {
      message: "Credentials do not match the selected provider type",
    }
  );

export type SetStorageConfigInput = z.infer<typeof setStorageConfigSchema>;

/**
 * Update storage configuration schema
 */
export const updateStorageConfigSchema = z.object({
  id: z.string(),
  providerName: z.string().optional(),
  isDefault: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export type UpdateStorageConfigInput = z.infer<
  typeof updateStorageConfigSchema
>;

/**
 * Get storage config by ID
 */
export const getStorageConfigSchema = z.object({
  id: z.string(),
});

export type GetStorageConfigInput = z.infer<typeof getStorageConfigSchema>;

/**
 * Delete storage config
 */
export const deleteStorageConfigSchema = z.object({
  id: z.string(),
});

export type DeleteStorageConfigInput = z.infer<
  typeof deleteStorageConfigSchema
>;

/**
 * Test storage connection
 */
export const testStorageConnectionSchema = z.object({
  id: z.string().optional(), // Optional: test existing config
  providerType: storageProviderEnum.optional(), // Or test new credentials
  credentials: z
    .union([
      s3CredentialsSchema,
      r2CredentialsSchema,
      googleDriveCredentialsSchema,
      nasCredentialsSchema,
    ])
    .optional(),
});

export type TestStorageConnectionInput = z.infer<
  typeof testStorageConnectionSchema
>;
