import {
  boolean,
  decimal,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Shows table - Photography sessions/bookings
 * Stores information about photography shoots including client details, pricing, and status
 */
export const show = pgTable("show", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  // Show details
  title: varchar("title", { length: 255 }).notNull(),
  clientName: varchar("client_name", { length: 255 }).notNull(),
  clientEmail: varchar("client_email", { length: 255 }),
  clientPhone: varchar("client_phone", { length: 50 }),

  // Shoot information
  shootType: varchar("shoot_type", { length: 100 }).notNull(), // Wedding, Portrait, Commercial, etc.
  location: text("location"),
  dateStart: timestamp("date_start", { withTimezone: true }).notNull(),
  dateEnd: timestamp("date_end", { withTimezone: true }).notNull(),

  // Business details
  pricing: decimal("pricing", { precision: 10, scale: 2 }),
  currency: varchar("currency", { length: 3 }).default("USD"),

  // Status workflow: pending -> confirmed -> completed -> delivered
  status: varchar("status", { length: 50 }).notNull().default("pending"),

  // Additional information
  notes: text("notes"),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

/**
 * Show reminders table
 * Stores scheduled reminders for shows (1 day before, 1 hour before, etc.)
 */
export const showReminder = pgTable("show_reminder", {
  id: text("id").primaryKey(),
  showId: text("show_id")
    .notNull()
    .references(() => show.id, { onDelete: "cascade" }),

  // Reminder configuration
  triggerType: varchar("trigger_type", { length: 50 }).notNull(), // "1_day_before", "1_hour_before", "custom"
  triggerTime: timestamp("trigger_time", { withTimezone: true }).notNull(),

  // Status
  sent: boolean("sent").notNull().default(false),
  sentAt: timestamp("sent_at", { withTimezone: true }),

  // Timestamps
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
