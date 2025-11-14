import { z } from "zod";

/**
 * Create album link schema
 */
export const createAlbumLinkSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
	expirationDate: z.coerce.date().optional(),
	allowDownload: z.boolean().default(true).optional(),
});

export type CreateAlbumLinkInput = z.infer<typeof createAlbumLinkSchema>;

/**
 * Get by token schema (public)
 */
export const getByTokenSchema = z.object({
	token: z.string().min(1, "Token is required"),
});

export type GetByTokenInput = z.infer<typeof getByTokenSchema>;

/**
 * List links schema
 */
export const listLinksSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
});

export type ListLinksInput = z.infer<typeof listLinksSchema>;

/**
 * Update link schema
 */
export const updateLinkSchema = z.object({
	linkId: z.string().min(1, "Link ID is required"),
	expirationDate: z.coerce.date().nullable().optional(),
	allowDownload: z.boolean().optional(),
	isActive: z.boolean().optional(),
});

export type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

/**
 * Delete link schema
 */
export const deleteLinkSchema = z.object({
	linkId: z.string().min(1, "Link ID is required"),
});

export type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

/**
 * Get link stats schema
 */
export const getLinkStatsSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
});

export type GetLinkStatsInput = z.infer<typeof getLinkStatsSchema>;

/**
 * Get image download URL schema (public)
 */
export const getImageDownloadUrlSchema = z.object({
	token: z.string().min(1, "Token is required"),
	imageId: z.string().min(1, "Image ID is required"),
});

export type GetImageDownloadUrlInput = z.infer<
	typeof getImageDownloadUrlSchema
>;
