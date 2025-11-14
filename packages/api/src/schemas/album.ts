import { z } from "zod";

/**
 * Create album schema
 */
export const createAlbumSchema = z.object({
	showId: z.string().min(1, "Show ID is required"),
	name: z.string().min(1, "Album name is required").max(255),
	description: z.string().max(1000).optional(),
	imageIds: z.array(z.string()).optional(),
});

export type CreateAlbumInput = z.infer<typeof createAlbumSchema>;

/**
 * Update album schema
 */
export const updateAlbumSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
	name: z.string().min(1).max(255).optional(),
	description: z.string().max(1000).optional(),
});

export type UpdateAlbumInput = z.infer<typeof updateAlbumSchema>;

/**
 * Get album by ID schema
 */
export const getAlbumByIdSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
});

export type GetAlbumByIdInput = z.infer<typeof getAlbumByIdSchema>;

/**
 * Delete album schema
 */
export const deleteAlbumSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
});

export type DeleteAlbumInput = z.infer<typeof deleteAlbumSchema>;

/**
 * Add images to album schema
 */
export const addImagesToAlbumSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
	imageIds: z
		.array(z.string())
		.min(1, "At least one image is required")
		.max(500, "Maximum 500 images per batch"),
});

export type AddImagesToAlbumInput = z.infer<typeof addImagesToAlbumSchema>;

/**
 * Remove images from album schema
 */
export const removeImagesFromAlbumSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
	albumImageIds: z
		.array(z.string())
		.min(1, "At least one album image ID is required"),
});

export type RemoveImagesFromAlbumInput = z.infer<
	typeof removeImagesFromAlbumSchema
>;

/**
 * Reorder album images schema
 */
export const reorderAlbumImagesSchema = z.object({
	albumId: z.string().min(1, "Album ID is required"),
	imageOrders: z
		.array(
			z.object({
				albumImageId: z.string(),
				position: z.number().int().min(0),
			}),
		)
		.min(1, "At least one image order is required"),
});

export type ReorderAlbumImagesInput = z.infer<typeof reorderAlbumImagesSchema>;
