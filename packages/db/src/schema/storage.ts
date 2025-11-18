import {
  bigint,
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Storage configurations table - Cloud storage settings per user
 * Stores encrypted credentials for Google Drive, S3, R2, NAS, etc.
 */
export const storageConfig = pgTable("storage_config", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Provider information
  providerType: varchar("provider_type", { length: 50 }).notNull(), // google_drive, s3, r2, nas
  providerName: varchar("provider_name", { length: 100 }), // Custom name (e.g., "My Google Drive", "Company S3")

  // Encrypted credentials (JSON string encrypted with AES-256)
  credentialsEncrypted: text("credentials_encrypted").notNull(),

  // Configuration details (non-sensitive)
  bucketName: varchar("bucket_name", { length: 255 }), // For S3/R2
  region: varchar("region", { length: 100 }), // For AWS S3
  folderPath: varchar("folder_path", { length: 500 }), // Base folder path
  publicUrl: text("public_url"), // CDN or public URL base

  // Status
  isActive: boolean("is_active").notNull().default(true),
  isDefault: boolean("is_default").notNull().default(false), // Default storage for new uploads

  // Usage tracking
  totalStorageUsed: bigint("total_storage_used", { mode: "number" }).default(0), // in bytes
  totalFilesCount: bigint("total_files_count", { mode: "number" }).default(0),

  // Connection test
  lastTestedAt: timestamp("last_tested_at", { withTimezone: true }),
  lastTestSuccess: boolean("last_test_success"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
