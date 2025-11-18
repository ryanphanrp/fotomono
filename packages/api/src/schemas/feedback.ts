import { z } from "zod";

/**
 * Submit feedback schema (public)
 */
export const submitFeedbackSchema = z.object({
  token: z.string().min(1, "Token is required"),
  rating: z.number().int().min(1).max(5).optional(),
  feedbackText: z.string().max(2000).optional(),
  clientName: z.string().max(255).optional(),
  clientEmail: z.string().email().max(255).optional(),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;

/**
 * Get feedback by album schema
 */
export const getFeedbackByAlbumSchema = z.object({
  albumId: z.string().min(1, "Album ID is required"),
});

export type GetFeedbackByAlbumInput = z.infer<typeof getFeedbackByAlbumSchema>;

/**
 * Get feedback stats schema
 */
export const getFeedbackStatsSchema = z.object({
  albumId: z.string().min(1, "Album ID is required"),
});

export type GetFeedbackStatsInput = z.infer<typeof getFeedbackStatsSchema>;
