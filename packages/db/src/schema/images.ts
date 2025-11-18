import {
  integer,
  json,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { show } from "./shows";

/**
 * Images table - Uploaded photos from shows
 * Stores metadata and links to cloud storage
 */
export const image = pgTable("image", {
  id: text("id").primaryKey(),
  showId: text("show_id")
    .notNull()
    .references(() => show.id, { onDelete: "cascade" }),

  // Storage information
  storagePath: text("storage_path").notNull(), // Path in storage provider
  storageProvider: varchar("storage_provider", { length: 50 }).notNull(), // google_drive, s3, r2, nas
  filename: varchar("filename", { length: 255 }).notNull(),
  originalFilename: varchar("original_filename", { length: 255 }).notNull(),

  // URLs
  url: text("url").notNull(), // Public URL or signed URL
  thumbnailSmallUrl: text("thumbnail_small_url"), // 300px
  thumbnailMediumUrl: text("thumbnail_medium_url"), // 800px
  thumbnailLargeUrl: text("thumbnail_large_url"), // 1920px

  // File metadata
  fileSize: integer("file_size").notNull(), // in bytes
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  width: integer("width"),
  height: integer("height"),

  // EXIF data (camera settings, GPS, etc.)
  exifData: json("exif_data").$type<{
    camera?: string;
    lens?: string;
    iso?: number;
    aperture?: string;
    shutterSpeed?: string;
    focalLength?: string;
    dateTaken?: string;
    gps?: {
      latitude?: number;
      longitude?: number;
    };
  }>(),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Image tags table - Categories and tags for images
 * Allows photographers to organize and filter images
 */
export const imageTag = pgTable("image_tag", {
  id: text("id").primaryKey(),
  imageId: text("image_id")
    .notNull()
    .references(() => image.id, { onDelete: "cascade" }),

  tagName: varchar("tag_name", { length: 100 }).notNull(),
  category: varchar("category", { length: 100 }), // Wedding, Portrait, Commercial, etc.

  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Image approvals table - Client approval workflow
 * Tracks which images clients have approved for portfolio
 */
export const imageApproval = pgTable("image_approval", {
  id: text("id").primaryKey(),
  imageId: text("image_id")
    .notNull()
    .references(() => image.id, { onDelete: "cascade" }),

  // Approval status: pending, approved, rejected
  status: varchar("status", { length: 50 }).notNull().default("pending"),

  // Approval link token for client access
  approvalToken: varchar("approval_token", { length: 255 }).unique(),
  approvalTokenExpiresAt: timestamp("approval_token_expires_at", {
    withTimezone: true,
  }),

  // Client information
  clientApprovedAt: timestamp("client_approved_at", { withTimezone: true }),
  clientRejectedAt: timestamp("client_rejected_at", { withTimezone: true }),
  clientFeedback: text("client_feedback"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
