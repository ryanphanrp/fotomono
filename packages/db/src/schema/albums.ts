import {
	pgTable,
	text,
	timestamp,
	integer,
	varchar,
	boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { show } from "./shows";
import { image } from "./images";

/**
 * Client albums table - Collections of images for delivery to clients
 * Each album can have multiple shareable links with different settings
 */
export const clientAlbum = pgTable("client_album", {
	id: text("id").primaryKey(),
	showId: text("show_id")
		.notNull()
		.references(() => show.id, { onDelete: "cascade" }),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),

	// Album details
	name: varchar("name", { length: 255 }),
	description: text("description"),

	// Timestamps
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

/**
 * Client album images - Junction table for many-to-many relationship
 * Links images to albums
 */
export const clientAlbumImage = pgTable("client_album_image", {
	id: text("id").primaryKey(),
	albumId: text("album_id")
		.notNull()
		.references(() => clientAlbum.id, { onDelete: "cascade" }),
	imageId: text("image_id")
		.notNull()
		.references(() => image.id, { onDelete: "cascade" }),

	// Position in album
	position: integer("position").notNull().default(0),

	// Timestamps
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

/**
 * Client album links - Shareable links for client access
 * Secure, expirable links for clients to view and download their photos
 */
export const clientAlbumLink = pgTable("client_album_link", {
	id: text("id").primaryKey(),
	albumId: text("album_id")
		.notNull()
		.references(() => clientAlbum.id, { onDelete: "cascade" }),

	// Unique token for access
	token: varchar("token", { length: 255 }).notNull().unique(),

	// Access control
	expirationDate: timestamp("expiration_date", { withTimezone: true }),
	allowDownload: boolean("allow_download").notNull().default(true),
	password: varchar("password", { length: 255 }), // Phase 2 - hashed password
	isActive: boolean("is_active").notNull().default(true),

	// Analytics
	accessedCount: integer("accessed_count").notNull().default(0),
	lastAccessedAt: timestamp("last_accessed_at", { withTimezone: true }),

	// Timestamps
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

/**
 * Client feedback - Ratings and comments from clients
 * Collected through the album link interface
 */
export const clientFeedback = pgTable("client_feedback", {
	id: text("id").primaryKey(),
	linkId: text("link_id")
		.notNull()
		.references(() => clientAlbumLink.id, { onDelete: "cascade" }),

	// Feedback data
	rating: integer("rating"), // 1-5 stars
	feedbackText: text("feedback_text"),

	// Client info (optional - if they want to leave contact info)
	clientName: varchar("client_name", { length: 255 }),
	clientEmail: varchar("client_email", { length: 255 }),

	// Timestamps
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
