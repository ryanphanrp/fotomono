import { z } from "zod";

/**
 * Zod validation schemas for show management
 */

// Show status enum
export const showStatusEnum = z.enum([
  "pending",
  "confirmed",
  "completed",
  "delivered",
  "cancelled",
]);

export type ShowStatus = z.infer<typeof showStatusEnum>;

// Show type/category enum
export const shootTypeEnum = z.enum([
  "wedding",
  "portrait",
  "commercial",
  "product",
  "event",
  "lifestyle",
  "real_estate",
  "family",
  "newborn",
  "engagement",
  "corporate",
  "other",
]);

export type ShootType = z.infer<typeof shootTypeEnum>;

// Create show input schema
export const createShowSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(255),
  clientName: z
    .string()
    .min(2, "Client name must be at least 2 characters")
    .max(255),
  clientEmail: z.string().email("Invalid email address").optional(),
  clientPhone: z.string().max(50).optional(),
  shootType: shootTypeEnum,
  location: z.string().max(500).optional(),
  dateStart: z.date(),
  dateEnd: z.date(),
  pricing: z.string().or(z.number()).optional(), // Can be string for decimal or number
  currency: z.string().length(3).default("USD").optional(),
  notes: z.string().max(5000).optional(),
});

export type CreateShowInput = z.infer<typeof createShowSchema>;

// Update show input schema (all fields optional except ID)
export const updateShowSchema = z.object({
  id: z.string(),
  title: z.string().min(2).max(255).optional(),
  clientName: z.string().min(2).max(255).optional(),
  clientEmail: z.string().email().optional().or(z.literal("")),
  clientPhone: z.string().max(50).optional().or(z.literal("")),
  shootType: shootTypeEnum.optional(),
  location: z.string().max(500).optional().or(z.literal("")),
  dateStart: z.date().optional(),
  dateEnd: z.date().optional(),
  pricing: z.string().or(z.number()).optional().or(z.literal("")),
  currency: z.string().length(3).optional(),
  notes: z.string().max(5000).optional().or(z.literal("")),
});

export type UpdateShowInput = z.infer<typeof updateShowSchema>;

// Update show status input
export const updateShowStatusSchema = z.object({
  id: z.string(),
  status: showStatusEnum,
});

export type UpdateShowStatusInput = z.infer<typeof updateShowStatusSchema>;

// List shows filters
export const listShowsSchema = z.object({
  status: showStatusEnum.optional(),
  shootType: shootTypeEnum.optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  search: z.string().optional(), // Search by title or client name
  limit: z.number().min(1).max(100).default(50).optional(),
  offset: z.number().min(0).default(0).optional(),
});

export type ListShowsInput = z.infer<typeof listShowsSchema>;

// Calendar view filters
export const calendarViewSchema = z.object({
  year: z.number().min(2020).max(2100),
  month: z.number().min(1).max(12),
  view: z.enum(["month", "week", "day"]).default("month").optional(),
});

export type CalendarViewInput = z.infer<typeof calendarViewSchema>;

// Get show by ID
export const getShowByIdSchema = z.object({
  id: z.string(),
});

export type GetShowByIdInput = z.infer<typeof getShowByIdSchema>;

// Delete show
export const deleteShowSchema = z.object({
  id: z.string(),
});

export type DeleteShowInput = z.infer<typeof deleteShowSchema>;
