import { z } from "zod";

/**
 * Image upload schema
 * Note: For file uploads, we'll handle the actual file buffer separately
 * This schema is for the metadata
 */
export const uploadImageSchema = z.object({
	showId: z.string().min(1, "Show ID is required"),
	filename: z.string().min(1, "Filename is required"),
	mimeType: z.string().min(1, "MIME type is required"),
	size: z.number().positive("File size must be positive"),
	storageConfigId: z.string().optional(),
	tags: z.array(z.string()).optional(),
	category: z.string().optional(),
});

export type UploadImageInput = z.infer<typeof uploadImageSchema>;

/**
 * Get images by show ID
 */
export const getImagesByShowSchema = z.object({
	showId: z.string(),
	filter: z
		.enum(["all", "portfolio", "archived"])
		.default("all")
		.optional(),
	limit: z.number().min(1).max(100).default(50).optional(),
	offset: z.number().min(0).default(0).optional(),
});

export type GetImagesByShowInput = z.infer<typeof getImagesByShowSchema>;

/**
 * Get image by ID
 */
export const getImageByIdSchema = z.object({
	id: z.string(),
});

export type GetImageByIdInput = z.infer<typeof getImageByIdSchema>;

/**
 * Update image metadata
 */
export const updateImageSchema = z.object({
	id: z.string(),
	filename: z.string().optional(),
	tags: z.array(z.string()).optional(),
	category: z.string().optional(),
	caption: z.string().optional(),
	altText: z.string().optional(),
});

export type UpdateImageInput = z.infer<typeof updateImageSchema>;

/**
 * Update image tags
 */
export const updateImageTagsSchema = z.object({
	id: z.string(),
	tags: z.array(z.string()),
	append: z.boolean().default(false), // If true, append to existing tags; if false, replace
});

export type UpdateImageTagsInput = z.infer<typeof updateImageTagsSchema>;

/**
 * Mark image for portfolio
 */
export const markForPortfolioSchema = z.object({
	id: z.string(),
	isPortfolio: z.boolean(),
});

export type MarkForPortfolioInput = z.infer<typeof markForPortfolioSchema>;

/**
 * Archive/unarchive image
 */
export const archiveImageSchema = z.object({
	id: z.string(),
	isArchived: z.boolean(),
});

export type ArchiveImageInput = z.infer<typeof archiveImageSchema>;

/**
 * Delete image
 */
export const deleteImageSchema = z.object({
	id: z.string(),
	deleteFromStorage: z.boolean().default(true),
});

export type DeleteImageInput = z.infer<typeof deleteImageSchema>;

/**
 * Bulk operations
 */
export const bulkUpdateImagesSchema = z.object({
	imageIds: z.array(z.string()).min(1, "At least one image ID is required"),
	operation: z.enum([
		"mark_portfolio",
		"unmark_portfolio",
		"archive",
		"unarchive",
		"delete",
	]),
	tags: z.array(z.string()).optional(), // For tag operations
	category: z.string().optional(), // For category operations
});

export type BulkUpdateImagesInput = z.infer<typeof bulkUpdateImagesSchema>;

/**
 * Search images
 */
export const searchImagesSchema = z.object({
	query: z.string().optional(),
	tags: z.array(z.string()).optional(),
	category: z.string().optional(),
	isPortfolio: z.boolean().optional(),
	isArchived: z.boolean().optional(),
	showId: z.string().optional(),
	limit: z.number().min(1).max(100).default(50).optional(),
	offset: z.number().min(0).default(0).optional(),
});

export type SearchImagesInput = z.infer<typeof searchImagesSchema>;
