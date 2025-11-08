import {
	pgTable,
	text,
	timestamp,
	integer,
	varchar,
	json,
} from "drizzle-orm/pg-core";
import { user } from "./auth";
import { image } from "./images";

/**
 * Portfolio images table - Curated collection of best work
 * Images that appear on photographer's public portfolio
 */
export const portfolioImage = pgTable("portfolio_image", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => user.id, { onDelete: "cascade" }),
	imageId: text("image_id")
		.notNull()
		.references(() => image.id, { onDelete: "cascade" }),

	// Organization
	category: varchar("category", { length: 100 }), // Wedding, Portrait, Commercial, etc.
	tags: json("tags").$type<string[]>().default([]), // Array of tag names
	position: integer("position").notNull().default(0), // Custom sort order

	// Publication
	publishedAt: timestamp("published_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	unpublishedAt: timestamp("unpublished_at", { withTimezone: true }),

	// Timestamps
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});

/**
 * Portfolio settings table - Customization for public portfolio
 * Theme, colors, bio, social links, etc.
 */
export const portfolioSettings = pgTable("portfolio_settings", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.unique()
		.references(() => user.id, { onDelete: "cascade" }),

	// Subdomain & branding
	subdomain: varchar("subdomain", { length: 100 }).unique().notNull(),
	customDomain: varchar("custom_domain", { length: 255 }), // Phase 2

	// Theme & design
	theme: varchar("theme", { length: 50 }).notNull().default("default"), // default, minimal, modern, classic, etc.
	primaryColor: varchar("primary_color", { length: 7 }).default("#000000"),
	accentColor: varchar("accent_color", { length: 7 }).default("#FF6B6B"),

	// Profile
	bio: text("bio"),
	logoUrl: text("logo_url"),
	profileImageUrl: text("profile_image_url"),

	// Contact & social
	contactEmail: varchar("contact_email", { length: 255 }),
	contactPhone: varchar("contact_phone", { length: 50 }),
	socialLinks: json("social_links").$type<{
		instagram?: string;
		facebook?: string;
		twitter?: string;
		linkedin?: string;
		pinterest?: string;
		website?: string;
	}>(),

	// SEO
	metaTitle: varchar("meta_title", { length: 255 }),
	metaDescription: text("meta_description"),

	// Timestamps
	createdAt: timestamp("created_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true })
		.notNull()
		.defaultNow(),
});
